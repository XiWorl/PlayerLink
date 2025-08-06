function ConversationItem({ conversation, isSelected, onClick }) {
	const { name, lastMessage, timestamp, unread } = conversation

	return (
		<div
			className={`conversation-item ${isSelected ? "selected" : ""}`}
			onClick={onClick}
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
