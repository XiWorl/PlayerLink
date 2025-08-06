import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { TOKEN_SESSION_KEY } from "../utils/globalUtils"
import messageService from "../services/messageService"
import ConversationList from "../components/Messages/ConversationList"
import MessageThread from "../components/Messages/MessageThread"
import Navbar from "../components/Navbar/Navbar"
import "../components/Messages/Messages.css"

export default function MessagesPage() {
	const [selectedConversation, setSelectedConversation] = useState(null)
	const [conversations, setConversations] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Get query parameters
	const [searchParams] = useSearchParams()
	const queryUserId = searchParams.get("userId")
	const queryName = searchParams.get("name")

	// Connect to WebSocket and fetch conversations on component mount
	useEffect(() => {
		const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
		if (!token) {
			setError("Authentication required")
			setLoading(false)
			return
		}

		// Connect to WebSocket server
		messageService
			.connect(token)
			.then(() => {
				// Fetch conversations
				return messageService.getAllConversations()
			})
			.then((fetchedConversations) => {
				setConversations(fetchedConversations)

				// If we have query parameters, find or create the conversation
				if (queryUserId && queryName) {
					const userId = parseInt(queryUserId)
					// Check if the conversation already exists
					const existingConversation = fetchedConversations.find(
						(conv) => conv.userId === userId
					)

					if (existingConversation) {
						// Use the existing conversation
						setSelectedConversation({
							id: existingConversation.userId,
							name: existingConversation.name,
							avatar: null,
							lastMessage:
								existingConversation.lastMessage?.content ||
								"No messages yet",
							timestamp: existingConversation.lastMessage
								? formatTimestamp(
										new Date(
											existingConversation.lastMessage.createdAt
										)
								  )
								: "",
							unread: existingConversation.unreadCount > 0,
						})
					} else {
						// Create a new conversation object
						const newConversation = {
							userId: userId,
							name: queryName,
							accountType: "unknown", // We don't know the account type yet
							lastMessage: null,
							unreadCount: 0,
							isOnline: false,
						}

						// Add the new conversation to the list
						setConversations((prevConversations) => [
							...prevConversations,
							newConversation,
						])

						// Set it as the selected conversation
						setSelectedConversation({
							id: userId,
							name: queryName,
							avatar: null,
							lastMessage: "No messages yet",
							timestamp: "",
							unread: false,
						})
					}
				}

				setLoading(false)
			})
			.catch((err) => {
				console.error("Error connecting to message service:", err)
				setError("Failed to load conversations")
				setLoading(false)
			})

		// Listen for new messages and conversation updates
		const newMessageHandler = (message) => {
			// Update conversations list with new message
			setConversations((prevConversations) => {
				const updatedConversations = [...prevConversations]
				const conversationIndex = updatedConversations.findIndex(
					(conv) =>
						conv.userId === message.senderId ||
						conv.userId === message.receiverId
				)

				if (conversationIndex !== -1) {
					// Update existing conversation
					updatedConversations[conversationIndex] = {
						...updatedConversations[conversationIndex],
						lastMessage: {
							...message,
						},
						unreadCount:
							message.receiverId ===
							updatedConversations[conversationIndex].userId
								? (updatedConversations[conversationIndex].unreadCount ||
										0) + 1
								: updatedConversations[conversationIndex].unreadCount,
					}
				}
				return updatedConversations
			})
		}

		messageService.addEventListener("newMessage", newMessageHandler)

		// Clean up on unmount
		return () => {
			messageService.removeEventListener("newMessage", newMessageHandler)
			messageService.disconnect()
		}
	}, [])

	// Format conversations for display
	const formattedConversations = conversations.map((conv) => ({
		id: conv.userId,
		name: conv.name,
		avatar: null,
		lastMessage: conv.lastMessage?.content || "No messages yet",
		timestamp: conv.lastMessage
			? formatTimestamp(new Date(conv.lastMessage.createdAt))
			: "",
		unread: conv.unreadCount > 0,
	}))

	// Helper function to format timestamps
	function formatTimestamp(date) {
		const now = new Date()
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)

		if (date >= today) {
			return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
		} else if (date >= yesterday) {
			return "Yesterday"
		} else {
			const daysOfWeek = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			]
			const dayDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24))

			if (dayDiff < 7) {
				return daysOfWeek[date.getDay()]
			} else {
				return date.toLocaleDateString([], { month: "short", day: "numeric" })
			}
		}
	}

	return (
		<>
			<Navbar />
			<div className="messages-page">
				<div className="messages-container">
					{loading ? (
						<div className="loading">Loading conversations...</div>
					) : error ? (
						<div className="error">{error}</div>
					) : (
						<ConversationList
							conversations={formattedConversations}
							selectedId={selectedConversation?.id}
							onSelectConversation={setSelectedConversation}
						/>
					)}
					{selectedConversation ? (
						<MessageThread conversation={selectedConversation} />
					) : (
						<div className="empty-state">
							<div className="empty-state-content">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="64"
									height="64"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
								</svg>
								<h3>No conversation selected</h3>
								<p>
									Choose a conversation from the list or start a new one
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
