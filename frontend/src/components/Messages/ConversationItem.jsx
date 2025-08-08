import { useEffect, useState } from "react"
import { getAccountDataFromSessionStorage } from "../../utils/globalUtils"
import messageService from "../../services/messageService"

function ConversationItem({ conversation, isSelected, onClick }) {
	const { id, name, lastMessage, timestamp, unread: initialUnread } = conversation
	const [unread, setUnread] = useState(initialUnread)

	// Update unread state when the conversation prop changes
	useEffect(() => {
		setUnread(initialUnread)
	}, [initialUnread])

	// Listen for new messages to update unread status in real-time
	useEffect(() => {
		// Get current user ID from session storage
		const userData = getAccountDataFromSessionStorage()
		const currentUserId = userData.id

		const handleNewMessage = (message) => {
			// If this is a message for this conversation and we're not the sender
			// and the conversation is not currently selected, mark it as unread
			if (
				(message.senderId === id || message.receiverId === id) &&
				message.senderId !== currentUserId &&
				!isSelected
			) {
				setUnread(true)
			}
		}

		messageService.addEventListener("newMessage", handleNewMessage)

		return () => {
			messageService.removeEventListener("newMessage", handleNewMessage)
		}
	}, [id, isSelected])

	// When the conversation is selected, mark it as read
	useEffect(() => {
		if (isSelected && unread) {
			setUnread(false)
		}
	}, [isSelected])

	const handleClick = () => {
		// Mark as read when clicked
		setUnread(false)
		onClick()
	}

	return (
		<div
			className={`conversation-item ${isSelected ? "selected" : ""}`}
			onClick={handleClick}
		>
			<div className="avatar-placeholder"></div>
			<div className="conversation-details">
				<div className="conversation-header">
					<h3 className="conversation-name">{name}</h3>
					<span className="conversation-time">{timestamp}</span>
				</div>
				<div className="conversation-header">
					<p className="conversation-preview">{lastMessage}</p>
					{unread && <div className="unread-indicator"></div>}
				</div>
			</div>
		</div>
	)
}

export default ConversationItem
