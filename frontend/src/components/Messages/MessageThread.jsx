import { useState, useEffect } from "react"
import { getAccountDataFromSessionStorage } from "../../utils/globalUtils"
import messageService from "../../services/messageService"
import MessageBubble from "./MessageBubble"

function MessageThread({ conversation }) {
	const [messageText, setMessageText] = useState("")
	const [messages, setMessages] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [currentUserId, setCurrentUserId] = useState(null)

	// Get current user ID from localStorage
	useEffect(() => {
		try {
			const userData = getAccountDataFromSessionStorage()
			if (userData && userData.id) {
				setCurrentUserId(userData.id)
			}
		} catch (err) {
			console.error("Error getting user data:", err)
		}
	}, [])

	// Fetch messages when conversation changes
	useEffect(() => {
		if (!conversation || !conversation.id) return

		setLoading(true)
		setError(null)

		// Mark all messages as read when opening a conversation
		messageService
			.markAllMessagesRead(conversation.id)
			.catch((err) => console.error("Error marking messages as read:", err))

		// Fetch conversation messages
		messageService
			.getConversationWithUser(conversation.id)
			.then((fetchedMessages) => {
				setMessages(fetchedMessages)
				setLoading(false)
			})
			.catch((err) => {
				console.error("Error fetching messages:", err)
				setError("Failed to load messages")
				setLoading(false)
			})

		// Listen for new messages
		const newMessageHandler = (message) => {
			// Only add the message if it belongs to this conversation
			if (
				message.senderId === conversation.id ||
				message.receiverId === conversation.id
			) {
				setMessages((prevMessages) => [...prevMessages, message])

				// Mark message as read if we're the receiver
				if (message.receiverId === currentUserId && !message.isRead) {
					messageService
						.markMessageRead(message.id)
						.catch((err) =>
							console.error("Error marking message as read:", err)
						)
				}
			}
		}

		messageService.addEventListener("newMessage", newMessageHandler)

		// Clean up
		return () => {
			messageService.removeEventListener("newMessage", newMessageHandler)
		}
	}, [conversation, currentUserId])

	function handleSendMessage(e) {
		e.preventDefault()
		if (messageText.trim() && conversation && conversation.id) {
			const messageContent = messageText.trim()

			// Create a temporary message to display immediately
			const tempMessage = {
				id: `temp-${Date.now()}`,
				content: messageContent,
				createdAt: new Date().toISOString(),
				senderId: currentUserId,
				receiverId: conversation.id,
				isRead: false,
			}

			// Add temporary message to the UI immediately
			setMessages((prevMessages) => [...prevMessages, tempMessage])

			// Clear the input field
			setMessageText("")

			// Send message to backend
			messageService
				.sendMessageToUser(conversation.id, messageContent)
				.then((sentMessage) => {
					// Replace the temporary message with the real one from the server
					if (sentMessage) {
						setMessages((prevMessages) =>
							prevMessages.map((msg) =>
								msg.id === tempMessage.id ? sentMessage : msg
							)
						)
					}
				})
				.catch((err) => {
					console.error("Error sending message:", err)

					// Mark the temporary message as failed
					setMessages((prevMessages) =>
						prevMessages.map((msg) =>
							msg.id === tempMessage.id ? { ...msg, failed: true } : msg
						)
					)

					alert("Failed to send message. Please try again.")
				})
		}
	}

	// Format messages for display
	const formattedMessages = messages.map((message) => ({
		id: message.id,
		text: message.content,
		timestamp: formatTimestamp(new Date(message.createdAt)),
		sender: message.senderId === currentUserId ? "self" : "other",
		isRead: message.isRead,
	}))

	// Helper function to format timestamps
	function formatTimestamp(date) {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	}

	return (
		<div className="message-thread">
			<div className="thread-header">
				<div className="avatar-placeholder"></div>
				<div className="thread-header-info">
					<h3 className="thread-header-name">{conversation.name}</h3>
					<p className="thread-header-status">Online</p>
				</div>
			</div>

			<div className="messages">
				{loading ? (
					<div className="loading-messages">Loading messages...</div>
				) : error ? (
					<div className="error-messages">{error}</div>
				) : formattedMessages.length === 0 ? (
					<div className="no-messages">
						No messages yet. Start the conversation!
					</div>
				) : (
					formattedMessages.map((message) => (
						<MessageBubble
							key={message.id}
							message={message}
							isSent={message.sender === "self"}
						/>
					))
				)}
			</div>

			<form className="message-input-container" onSubmit={handleSendMessage}>
				<textarea
					className="message-input"
					placeholder="Type a message..."
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
				/>
				<button
					type="submit"
					className="send-button"
					disabled={!messageText.trim()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
					</svg>
				</button>
			</form>
		</div>
	)
}

export default MessageThread
