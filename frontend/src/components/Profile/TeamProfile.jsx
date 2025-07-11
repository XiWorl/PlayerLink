import { createContext, useState } from "react"
import { getAccountDataFromSessionStorage, AccountType } from "../../utils/globalUtils"
import ApplyButton from "./ApplyButton"
import "./ProfilePage.css"

const defaultProfileInfo = ""
export const TeamProfileContext = createContext()

export default function TeamProfile({ isLoading, accountData }) {
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	const [description, setDescription] = useState(
		accountData.description || defaultProfileInfo
	)
	const [overview, setOverview] = useState(accountData.overview || defaultProfileInfo)
	const sessionStorageAccountData = getAccountDataFromSessionStorage()

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
							<button>Home</button>
							<button>Roster</button>
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
						</div>
					</div>
				</div>
				<div className="profile-about">
					<div className="profile-about-header">
						<h3>Overview</h3>
					</div>
					<p className="profile-about-text">{`${overview}`}</p>
				</div>
			</div>
		</TeamProfileContext.Provider>
	)
}
