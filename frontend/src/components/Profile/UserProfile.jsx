import { AboutEditButton, BioEditButton } from "./EditButton"
import EditProfileButton from "./EditProfile"
import { createContext, useState } from "react"
import { AccountType } from "../../utils/globalUtils"
import "./ProfilePage.css"
const defaultProfileInfo = ""
import ModalBody from "../TheModal/ModalBody"

export const UserProfileContext = createContext()

export default function UserProfile({ isLoading, accountData }) {
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	const [bio, setBio] = useState(accountData.bio || defaultProfileInfo)
	const [about, setAbout] = useState(accountData.about || defaultProfileInfo)

	return (
		<UserProfileContext.Provider value={{ setAbout, setBio }}>
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
							<BioEditButton />
							{/* <EditProfileButton /> */}
						</div>
						<p className="profile-location">📍 {accountData.location}</p>
						<EditProfileButton accountType={AccountType.PLAYER} />
					</div>
				</div>
				<div className="profile-about">
					<div className="profile-about-header">
						<h3>About</h3>
						<AboutEditButton />
					</div>
					<p className="profile-about-text">{`${about}`}</p>
				</div>
				<div className="profile-about">
					<div className="profile-about-header">
						<h3>Gaming Experience</h3>
					</div>
					<div className="profile-gaming-container">
						<div className="profile-gaming-game">
							<img src="#" className="profile-gaming-icon" />
							<div className="profile-gaming-information">
								<h4>Game Name</h4>
								<div className="profile-gaming-performance">
									<p>Performance1</p>
									<p>Performance2</p>
									<p>Performance3</p>
									<p>Performance4</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserProfileContext.Provider>
	)
}
