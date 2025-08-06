import { useState } from "react"
import ConversationItem from "./ConversationItem"

function ConversationList({ conversations, selectedId, onSelectConversation }) {
	const [searchQuery, setSearchQuery] = useState("")

	const filteredConversations = conversations.filter(
		(conversation) =>
			conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
	)

	return (
		<div className="conversation-list">
			<div className="conversation-list-header">
				<h2>Messages</h2>
				<button className="new-message-btn" title="New message">
					+
				</button>
			</div>

			<div className="search-container">
				<input
					type="text"
					className="search-input"
					placeholder="Search messages"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<div className="conversations">
				{filteredConversations.length > 0 ? (
					filteredConversations.map((conversation) => (
						<ConversationItem
							key={conversation.id}
							conversation={conversation}
							isSelected={conversation.id === selectedId}
							onClick={() => onSelectConversation(conversation)}
						/>
					))
				) : (
					<div className="no-results">
						<p>No conversations found</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default ConversationList
