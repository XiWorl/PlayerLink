import { useState } from "react"
import MessageBubble from "./MessageBubble"

function MessageThread({ conversation }) {
	const [messageText, setMessageText] = useState("")

	//TODO: These are mock messages for testing purposes. Replace with real data from the backend in a future PR
	const mockMessages = [
		{
			id: 1,
			text: "Hey there! I saw your profile and I'm impressed with your gaming skills.",
			timestamp: "10:30 AM",
			sender: "other",
		},
		{
			id: 2,
			text: "Thanks! I've been practicing a lot lately.",
			timestamp: "10:32 AM",
			sender: "self",
		},
		{
			id: 3,
			text: "Are you interested in joining our team for the upcoming tournament?",
			timestamp: "10:33 AM",
			sender: "other",
		},
		{
			id: 4,
			text: "We're looking for someone with your expertise.",
			timestamp: "10:33 AM",
			sender: "other",
		},
		{
			id: 5,
			text: "That sounds interesting! What game are you competing in?",
			timestamp: "10:35 AM",
			sender: "self",
		},
		{
			id: 6,
			text: "We're focusing on Valorant this season. We have practice sessions every Tuesday and Thursday evening.",
			timestamp: "10:36 AM",
			sender: "other",
		},
	]

	function handleSendMessage(e) {
		e.preventDefault()
		if (messageText.trim()) {
			//TODO: Send message to backend and clear input
			setMessageText("")
		}
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
				{mockMessages.map((message) => (
					<MessageBubble
						key={message.id}
						message={message}
						isSent={message.sender === "self"}
					/>
				))}
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
					Icon
				</button>
			</form>
		</div>
	)
}

export default MessageThread
