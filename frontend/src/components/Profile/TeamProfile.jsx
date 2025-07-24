import { createContext, useState, useEffect } from "react"
import { getAccountDataFromSessionStorage, AccountType } from "../../utils/globalUtils"
import { incrementProfileVisit } from "../../api"
import { Roster } from "./Roster"
import ApplyButton from "./ApplyButton"
import EditProfileButton from "./EditProfile"
import "./ProfilePage.css"

const defaultProfileInfo = ""
export const TeamProfileContext = createContext()

const TabOptions = {
	HOME: "Home",
	ROSTER: "Roster",
}

async function addToProfileVisits(playerAccountId, teamAccountId) {
	await incrementProfileVisit(playerAccountId, teamAccountId)
}

export default function TeamProfile({ isLoading, accountData }) {
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	const [description, setDescription] = useState(
		accountData.description || defaultProfileInfo
	)
	const [selectedTab, setSelectedTab] = useState("Home")
	const [overview, setOverview] = useState(accountData.overview || defaultProfileInfo)
	const sessionStorageAccountData = getAccountDataFromSessionStorage()

	useEffect(() => {
		if (sessionStorageAccountData.accountType != AccountType.TEAM) {
			addToProfileVisits(sessionStorageAccountData.id, accountData.accountId)
		}
	}, [])

	return (
		<TeamProfileContext.Provider value={{ setDescription, setOverview }}>
			<div className="profile-page">
				<div className="profile-banner">
					<div className="profile-picture">
						<div className="profile-picture-placeholder">
							{accountData.name.charAt(0)}
						</div>
					</div>
				</div>
				<div className="profile-header">
					<div className="profile-info">
						<h1 className="profile-name">{`${accountData.name}`}</h1>
						<div className="profile-title">
							<p className="profile-title-text">{`${
								description || defaultProfileInfo
							}`}</p>
						</div>
						<p className="profile-location">📍 {accountData.location}</p>
					</div>
					<div>
						<div>
							<button onClick={() => setSelectedTab(TabOptions.HOME)}>
								Home
							</button>
							<button onClick={() => setSelectedTab(TabOptions.ROSTER)}>
								Roster
							</button>
							{sessionStorageAccountData &&
								sessionStorageAccountData.accountType !=
									AccountType.TEAM &&
								sessionStorageAccountData.id !==
									accountData.accountId && (
									<ApplyButton
										playerAccountId={sessionStorageAccountData.id}
										teamAccountId={accountData.accountId}
									/>
								)}
							<EditProfileButton accountType={AccountType.TEAM} />
						</div>
					</div>
				</div>

				{selectedTab === TabOptions.HOME && (
					<div className="profile-about">
						<div className="profile-about-header">
							<h3>Overview</h3>
						</div>
						<p className="profile-about-text">{`${overview}`}</p>
					</div>
				)}
				{selectedTab === TabOptions.ROSTER && (
					<Roster accountRosterIds={accountData.rosterAccountIds} />
				)}
			</div>
		</TeamProfileContext.Provider>
	)
}
