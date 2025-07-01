import { useParams, useLocation } from "react-router-dom"
import "./ProfilePage.css"

const sss = "profile-name"

export default function UserProfile() {
	//TODO: This is sample data - replace with actual user data in a future commit
	const testData = {
		name: "John Doe",
		location: "United States",
		bio: "Passionate software engineer with years of experience building scalable web applications and leading cross-functional teams.",
		about: "I'm a dedicated software engineer with expertise in full-stack development, specializing in React, Node.js, and cloud technologies.",
	}

	return (
		<div className="profile-page">
			<div className="profile-banner">
				<div className="profile-picture">
					<div className="profile-picture-placeholder">
						{testData.name.charAt(0)}
					</div>
				</div>
			</div>

			<div className="profile-header">
				<div className="profile-info">
					<h1 className="profile-name">{testData.name}</h1>
					<p className="profile-title">{testData.bio}</p>
					<p className="profile-location">📍 {testData.location}</p>
				</div>
			</div>

			<div className="profile-about">
				<h3>About</h3>
				<p className="profile-about-text">{testData.about}</p>
			</div>
		</div>
	)
}
