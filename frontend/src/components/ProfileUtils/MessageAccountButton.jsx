import { useNavigate } from "react-router-dom"
import { TOKEN_SESSION_KEY } from "../../utils/globalUtils"
import messageService from "../../services/messageService"

export default function MessageAccountButton({ profileData }) {
	const navigate = useNavigate()
    console.log(profileData)

	const handleMessageClick = async () => {
		try {
			// Get token from localStorage
			const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
			if (!token) {
				alert("You need to be logged in to send messages")
				return
			}

            let name = profileData.name
            if (name == null) {
                name = profileData.firstName + " " + profileData.lastName
            }

			// Connect to WebSocket if not already connected
			if (!messageService.connected) {
				await messageService.connect(token)
			}

			// Navigate to messages page with query params to open conversation
			navigate(
				`/messages?userId=${profileData.accountId}&name=${encodeURIComponent(
					name
				)}`
			)
		} catch (error) {
			console.error("Error navigating to messages:", error)
			alert("Failed to open message conversation. Please try again.")
		}
	}

	return (
		<button className="message-button" onClick={handleMessageClick}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				viewBox="0 0 16 16"
				style={{ marginRight: "5px" }}
			>
				<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
			</svg>
			Send Message
		</button>
	)
}
