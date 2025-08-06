function MessageBubble({ message, isSent }) {
	const { text, timestamp } = message

	return (
		<div className={`message-bubble ${isSent ? "sent" : "received"}`}>
			<div className="message-content">{text}</div>
			<div className="message-time">{timestamp}</div>
		</div>
	)
}

export default MessageBubble
