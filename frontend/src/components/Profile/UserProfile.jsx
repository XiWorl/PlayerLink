import { AboutEditButton, BioEditButton } from "./EditButton"
import { createContext, useState, useEffect, use } from "react"
import { TOKEN_STORAGE_KEY } from "../../utils/globalUtils"
import { getProfileDataWithToken } from "../../api"
import "./ProfilePage.css"
const defaultProfileInfo = ""

export const UserProfileContext = createContext()

async function doesUserOwnProfile(id, setIsOwnProfile) {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)
	const accountData = await getProfileDataWithToken(token)

	if (accountData.id.toString() === id.toString()) {
		setIsOwnProfile(true)
	} else {
		setIsOwnProfile(false)
	}
}

export default function UserProfile({ isLoading, accountData }) {
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	const [bio, setBio] = useState(accountData.bio || defaultProfileInfo)
	const [about, setAbout] = useState(accountData.about || defaultProfileInfo)
	const [isOwnProfile, setIsOwnProfile] = useState(false)

	useEffect(() => {
		doesUserOwnProfile(accountData.accountId, setIsOwnProfile)
	}, [])

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
							<BioEditButton isOwnProfile={isOwnProfile} />
						</div>
						<p className="profile-location">📍 {accountData.location}</p>
					</div>
				</div>
				<div className="profile-about">
					<div className="profile-about-header">
						<h3>About</h3>
						<AboutEditButton isOwnProfile={isOwnProfile} />
					</div>
					<p className="profile-about-text">{`${about}`}</p>
				</div>
			</div>
		</UserProfileContext.Provider>
	)
}
