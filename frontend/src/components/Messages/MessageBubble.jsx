function MessageBubble({ message, isSent }) {
	const { text, timestamp, failed } = message

	return (
		<div
			className={`message-bubble ${isSent ? "sent" : "received"} ${
				failed ? "failed" : ""
			}`}
		>
			<div className="message-content">{text}</div>
			<div className="message-time">
				{failed ? (
					<span className="message-failed">Failed to send - Tap to retry</span>
				) : (
					timestamp
				)}
			</div>
		</div>
	)
}

export default MessageBubble
