import { useState } from "react"
import ConversationList from "../components/Messages/ConversationList"
import MessageThread from "../components/Messages/MessageThread"
import Navbar from "../components/Navbar/Navbar"
import "../components/Messages/Messages.css"

export default function MessagesPage() {
	const [selectedConversation, setSelectedConversation] = useState(null)

	// Mock data for demonstration purposes
	const mockConversations = [
		{
			id: 1,
			name: "John Smith",
			avatar: null,
			lastMessage: "Hey, are you interested in joining our team?",
			timestamp: "10:30 AM",
			unread: true,
		},
		{
			id: 2,
			name: "Team Phantom",
			avatar: null,
			lastMessage: "We're looking for a new player for the upcoming tournament",
			timestamp: "Yesterday",
			unread: false,
		},
		{
			id: 3,
			name: "Sarah Johnson",
			avatar: null,
			lastMessage: "Thanks for the game yesterday!",
			timestamp: "Monday",
			unread: false,
		},
		{
			id: 4,
			name: "Gaming League",
			avatar: null,
			lastMessage: "Your application has been received",
			timestamp: "Aug 15",
			unread: false,
		},
		{
			id: 5,
			name: "Alex Williams",
			avatar: null,
			lastMessage: "Do you want to practice tonight?",
			timestamp: "Aug 10",
			unread: true,
		},
	]

	return (
		<>
			<Navbar />
			<div className="messages-page">
				<div className="messages-container">
					<ConversationList
						conversations={mockConversations}
						selectedId={selectedConversation?.id}
						onSelectConversation={setSelectedConversation}
					/>
					{selectedConversation ? (
						<MessageThread conversation={selectedConversation} />
					) : (
						<div className="empty-state">
							<div className="empty-state-content">
								Messages Icon
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
