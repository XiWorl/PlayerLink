const express = require("express")
const { PrismaClient } = require("../generated/prisma")
const { verifyUserAuthorization } = require("../api/apiUtils")

const router = express.Router()
const prisma = new PrismaClient()

/**
 * Get all conversations for the authenticated user
 */
router.get("/conversations", async (req, res, next) => {
	try {
		const verifiedUser = await verifyUserAuthorization(req.headers.authorization)

		if (!verifiedUser) {
			return res.status(401).json({ error: "Invalid authorization token" })
		}

		const userId = verifiedUser.id

		// Get all unique users this user has exchanged messages with
		const sentMessages = await prisma.message.findMany({
			where: { senderId: userId },
			select: { receiverId: true },
			distinct: ["receiverId"],
		})

		const receivedMessages = await prisma.message.findMany({
			where: { receiverId: userId },
			select: { senderId: true },
			distinct: ["senderId"],
		})

		// Combine unique user IDs
		const conversationUserIds = [
			...new Set([
				...sentMessages.map((msg) => msg.receiverId),
				...receivedMessages.map((msg) => msg.senderId),
			]),
		]

		// Get the latest message for each conversation
		const conversations = await Promise.all(
			conversationUserIds.map(async (otherUserId) => {
				const latestMessage = await prisma.message.findFirst({
					where: {
						OR: [
							{ senderId: userId, receiverId: otherUserId },
							{ senderId: otherUserId, receiverId: userId },
						],
					},
					orderBy: {
						createdAt: "desc",
					},
				})

				// Get unread count
				const unreadCount = await prisma.message.count({
					where: {
						senderId: otherUserId,
						receiverId: userId,
						isRead: false,
					},
				})

				// Get user info
				const otherUser = await prisma.account.findUnique({
					where: { id: otherUserId },
					include: {
						player: true,
						team: true,
					},
				})

				// Determine name based on account type
				let name = "Unknown User"
				if (otherUser.player) {
					name = `${otherUser.player.firstName} ${
						otherUser.player.lastName || ""
					}`.trim()
				} else if (otherUser.team) {
					name = otherUser.team.name
				}

				return {
					userId: otherUserId,
					name,
					accountType: otherUser.accountType,
					lastMessage: latestMessage,
					unreadCount,
				}
			})
		)

		return res.status(200).json(conversations)
	} catch (error) {
		next(error)
	}
})

/**
 * Get conversation history between the authenticated user and another user
 */
router.get("/conversation/:userId", async (req, res, next) => {
	try {
		const verifiedUser = await verifyUserAuthorization(req.headers.authorization)

		if (!verifiedUser) {
			return res.status(401).json({ error: "Invalid authorization token" })
		}

		const userId = verifiedUser.id
		const otherUserId = parseInt(req.params.userId)

		if (!otherUserId) {
			return res.status(400).json({ error: "Invalid user ID" })
		}

		// Get messages between the two users
		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{ senderId: userId, receiverId: otherUserId },
					{ senderId: otherUserId, receiverId: userId },
				],
			},
			orderBy: {
				createdAt: "asc",
			},
		})

		// Mark unread messages as read
		const unreadMessages = messages.filter(
			(msg) => msg.receiverId === userId && !msg.isRead
		)

		if (unreadMessages.length > 0) {
			await prisma.message.updateMany({
				where: {
					id: {
						in: unreadMessages.map((msg) => msg.id),
					},
				},
				data: {
					isRead: true,
				},
			})
		}

		return res.status(200).json(messages)
	} catch (error) {
		next(error)
	}
})

/**
 * Send a new message
 */
router.post("/send", async (req, res, next) => {
	try {
		const verifiedUser = await verifyUserAuthorization(req.headers.authorization)

		if (!verifiedUser) {
			return res.status(401).json({ error: "Invalid authorization token" })
		}

		const { receiverId, content } = req.body

		if (!receiverId || !content) {
			return res.status(400).json({ error: "Invalid message data" })
		}

		// Create message in database
		const message = await prisma.message.create({
			data: {
				content,
				senderId: verifiedUser.id,
				receiverId: parseInt(receiverId),
				isRead: false,
			},
		})

		return res.status(201).json(message)
	} catch (error) {
		next(error)
	}
})

/**
 * Mark a message as read
 */
router.patch("/read/:messageId", async (req, res, next) => {
	try {
		const verifiedUser = await verifyUserAuthorization(req.headers.authorization)

		if (!verifiedUser) {
			return res.status(401).json({ error: "Invalid authorization token" })
		}

		const messageId = parseInt(req.params.messageId)

		const message = await prisma.message.findUnique({
			where: { id: messageId },
		})

		// Only allow the receiver to mark messages as read
		if (!message || message.receiverId !== verifiedUser.id) {
			return res
				.status(403)
				.json({ error: "Not authorized to mark this message as read" })
		}

		const updatedMessage = await prisma.message.update({
			where: { id: messageId },
			data: { isRead: true },
		})

		return res.status(200).json(updatedMessage)
	} catch (error) {
		next(error)
	}
})

/**
 * Mark all messages in a conversation as read
 */
router.patch("/read-all/:userId", async (req, res, next) => {
	try {
		const verifiedUser = await verifyUserAuthorization(req.headers.authorization)

		if (!verifiedUser) {
			return res.status(401).json({ error: "Invalid authorization token" })
		}

		const otherUserId = parseInt(req.params.userId)

		const result = await prisma.message.updateMany({
			where: {
				senderId: otherUserId,
				receiverId: verifiedUser.id,
				isRead: false,
			},
			data: {
				isRead: true,
			},
		})

		return res.status(200).json({
			success: true,
			count: result.count,
		})
	} catch (error) {
		next(error)
	}
})

/**
 * Get unread message count for the authenticated user
 */
router.get("/unread-count", async (req, res, next) => {
	try {
		const verifiedUser = await verifyUserAuthorization(req.headers.authorization)

		if (!verifiedUser) {
			return res.status(401).json({ error: "Invalid authorization token" })
		}

		const count = await prisma.message.count({
			where: {
				receiverId: verifiedUser.id,
				isRead: false,
			},
		})

		return res.status(200).json({ count })
	} catch (error) {
		next(error)
	}
})

module.exports = router
