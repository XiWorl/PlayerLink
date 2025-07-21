import { AboutEditButton, BioEditButton } from "./EditButton"
import EditProfileButton from "./EditProfile"
import { createContext, useState } from "react"
import { AccountType } from "../../utils/globalUtils"
import GamingExperience from "./GamingExperience"
import "./ProfilePage.css"
const defaultProfileInfo = ""
import { TeamExperience } from "./TeamExperience"
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
				{Object.keys(accountData.games).length > 0 && (
					<div className="profile-about">
						<div className="profile-about-header">
							<h3>Gaming Experience</h3>
						</div>
						<GamingExperience accountData={accountData} />
					</div>
				)}
				<div className="profile-about">
					<div className="profile-about-header">
						<h3>Current Teams</h3>
					</div>
					<TeamExperience rosterAccountIds={accountData.rosterAccountIds} />
				</div>
			</div>
		</UserProfileContext.Provider>
	)
}
