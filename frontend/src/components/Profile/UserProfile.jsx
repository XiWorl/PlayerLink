import { AboutEditButton, BioEditButton } from "./EditButton"
import { getAccountDataFromSessionStorage, AccountType } from "../../utils/globalUtils"
import { useParams } from "react-router-dom"
import { createContext, useState, useEffect } from "react"
import "./ProfilePage.css"
const defaultProfileInfo = ""

export const UserProfileContext = createContext()

export default function UserProfile({ isLoading, accountData, setIsLoading }) {
	if (isLoading || accountData.teamId != null) {
		setIsLoading(true)
		return <h1>Loading...</h1>
	}

	useEffect(() => {
		setLoggedInAccountData(getAccountDataFromSessionStorage())
	}, [])

	const [bio, setBio] = useState(accountData.bio || defaultProfileInfo)
	const [about, setAbout] = useState(accountData.about || defaultProfileInfo)
	const [loggedInAccountData, setLoggedInAccountData] = useState(null)
	const { id } = useParams()

	return (
		<UserProfileContext.Provider
			value={{ setAbout, setBio, loggedInAccountData, id }}
		>
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
						</div>
						<p className="profile-location">📍 {accountData.location}</p>
					</div>
				</div>
				<div className="profile-about">
					<div className="profile-about-header">
						<h3>About</h3>
						<AboutEditButton />
					</div>
					<p className="profile-about-text">{`${about}`}</p>
				</div>
			</div>
		</UserProfileContext.Provider>
	)
}
