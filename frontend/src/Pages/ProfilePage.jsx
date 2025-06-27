import { useParams, useLocation } from "react-router-dom"

export default function ProfilePage() {
	const { email, given_name } = useLocation().state.token
	return (
		<div>
			<h1>
				Profile Page of {given_name} associated with {email}
			</h1>
			<p>This is the profile page.</p>
		</div>
	)
}
