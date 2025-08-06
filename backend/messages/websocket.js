const { Server } = require("socket.io")
const { PrismaClient } = require("../generated/prisma")
const { verifySessionToken } = require("../api/apiUtils")

const prisma = new PrismaClient()

// Map to store active user connections: { userId: socketId }
const activeUsers = new Map()

/**
 * Initialize WebSocket server with the HTTP server
 * @param {Object} httpServer - The HTTP server instance
 * @returns {Object} - The Socket.IO server instance
 */
function initializeWebSocketServer(httpServer) {
	const io = new Server(httpServer, {
		cors: {
			origin: "*", // In production, restrict this to your frontend domain
			methods: ["GET", "POST"],
		},
	})

	// Middleware to authenticate socket connections
	io.use(async (socket, next) => {
		try {
			const token = socket.handshake.auth.token
			if (!token) {
				return next(new Error("Authentication token is required"))
			}

			const user = await verifySessionToken(token)
			if (!user) {
				return next(new Error("Invalid authentication token"))
			}

			// Attach user data to socket for later use
			socket.user = user
			next()
		} catch (error) {
			next(new Error("Authentication failed"))
		}
	})

	// Handle socket connections
	io.on("connection", (socket) => {
		const userId = socket.user.id
		console.log(`User connected: ${userId}`)

		// Store user's active connection
		activeUsers.set(userId, socket.id)

		// Notify other users that this user is online
		io.emit("user_status", { userId, status: "online" })

		// Handle disconnect
		socket.on("disconnect", () => {
			console.log(`User disconnected: ${userId}`)
			activeUsers.delete(userId)
			io.emit("user_status", { userId, status: "offline" })
		})

		// Handle sending a new message
		socket.on("send_message", async (data) => {
			try {
				const { receiverId, content } = data

				if (!receiverId || !content) {
					socket.emit("error", { message: "Invalid message data" })
					return
				}

				// Create message in database
				const message = await prisma.message.create({
					data: {
						content,
						senderId: userId,
						receiverId: parseInt(receiverId),
						isRead: false,
					},
				})

				// Emit to sender
				socket.emit("message_sent", message)

				// Emit to receiver if online
				const receiverSocketId = activeUsers.get(parseInt(receiverId))
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("new_message", message)
				}
			} catch (error) {
				console.error("Error sending message:", error)
				socket.emit("error", { message: "Failed to send message" })
			}
		})

		// Handle marking messages as read
		socket.on("mark_as_read", async (data) => {
			try {
				const { messageId } = data

				const message = await prisma.message.findUnique({
					where: { id: parseInt(messageId) },
				})

				// Only allow the receiver to mark messages as read
				if (message && message.receiverId === userId) {
					await prisma.message.update({
						where: { id: parseInt(messageId) },
						data: { isRead: true },
					})

					// Notify the sender if they're online
					const senderSocketId = activeUsers.get(message.senderId)
					if (senderSocketId) {
						io.to(senderSocketId).emit("message_read", { messageId })
					}
				}
			} catch (error) {
				console.error("Error marking message as read:", error)
				socket.emit("error", { message: "Failed to mark message as read" })
			}
		})

		// Handle getting conversation history
		socket.on("get_conversation", async (data) => {
			try {
				const { otherUserId } = data

				if (!otherUserId) {
					socket.emit("error", { message: "Invalid user ID" })
					return
				}

				// Get messages between the two users
				const messages = await prisma.message.findMany({
					where: {
						OR: [
							{ senderId: userId, receiverId: parseInt(otherUserId) },
							{ senderId: parseInt(otherUserId), receiverId: userId },
						],
					},
					orderBy: {
						createdAt: "asc",
					},
				})

				socket.emit("conversation_history", { userId: otherUserId, messages })

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

					// Notify the sender that messages were read
					const senderSocketId = activeUsers.get(parseInt(otherUserId))
					if (senderSocketId) {
						io.to(senderSocketId).emit("messages_read", {
							messageIds: unreadMessages.map((msg) => msg.id),
						})
					}
				}
			} catch (error) {
				console.error("Error getting conversation:", error)
				socket.emit("error", { message: "Failed to get conversation history" })
			}
		})

		// Handle getting all conversations for a user
		socket.on("get_conversations", async () => {
			try {
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
							isOnline: activeUsers.has(otherUserId),
						}
					})
				)

				socket.emit("conversations_list", conversations)
			} catch (error) {
				console.error("Error getting conversations:", error)
				socket.emit("error", { message: "Failed to get conversations" })
			}
		})
	})

	return io
}

module.exports = { initializeWebSocketServer }
