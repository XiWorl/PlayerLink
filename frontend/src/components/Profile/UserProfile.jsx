import { EditProfileTextButton } from "./EditButton"
import {
	onBioModalSubmitButtonClicked,
	onAboutModalSubmitButtonClicked,
} from "./EditButtonUtils"
import { useParams } from "react-router-dom"
import { createContext, useState } from "react"
import "./ProfilePage.css"
const defaultProfileInfo = ""

export const UserProfileContext = createContext()

export default function UserProfile({ isLoading, accountData }) {
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	const { id } = useParams()
	const [bio, setBio] = useState(accountData.bio || defaultProfileInfo)
	const [about, setAbout] = useState(accountData.about || defaultProfileInfo)

	return (
		<UserProfileContext.Provider value={{ setAbout, setBio, id, bio, about }}>
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
						<div className="profile-title">
							<p className="profile-title-text">{`${bio}`}</p>
							<EditProfileTextButton
								modalTitle={"Edit Bio"}
								onSubmitButtonClicked={onBioModalSubmitButtonClicked}
								profileId={id}
							/>
						</div>
						<p className="profile-location">📍 {accountData.location}</p>
					</div>
				</div>
				<div className="profile-about">
					<div className="profile-about-header">
						<h3>About</h3>
						<EditProfileTextButton
							modalTitle={"Edit About"}
							onSubmitButtonClicked={onAboutModalSubmitButtonClicked}
							profileId={id}
						/>
					</div>
					<p className="profile-about-text">{`${about}`}</p>
				</div>
			</div>
		</UserProfileContext.Provider>
	)
}
