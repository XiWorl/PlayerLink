import { EditButton } from "./EditButton"
import "./ProfilePage.css"
const defaultProfileInfo = ""

export default function UserProfile({ isLoading, accountData }) {
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	return (
		<div className="profile-page">
			<div className="profile-banner">
				<div className="profile-picture">
					<div className="profile-picture-placeholder">
						{accountData.firstName.charAt(0)}
					</div>
				</div>
			</div>
			<div className="profile-header">
				<div className="profile-info">
					<h1 className="profile-name">{`${accountData.firstName} ${accountData.lastName}`}</h1>
					<p className="profile-title">{`${
						accountData.bio || defaultProfileInfo
					}`}</p>
					<p className="profile-location">📍 {accountData.location}</p>
				</div>
			</div>
			<div className="profile-about">
				<div className="profile-about-header">
					<h3>About</h3>
					<EditButton />
				</div>
				<p className="profile-about-text">{`${
					accountData.about || defaultProfileInfo
				}`}</p>
			</div>
		</div>
	)
}
