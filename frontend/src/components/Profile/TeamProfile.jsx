import { AboutEditButton, BioEditButton } from "./EditButton"
import { createContext, useState, useEffect } from "react"
import { TOKEN_STORAGE_KEY, AccountType } from "../../utils/globalUtils"
import { getProfileDataWithToken, createApplication } from "../../api"
import { useNavigate } from "react-router-dom"
import "./ProfilePage.css"
const defaultProfileInfo = ""

export const TeamProfileContext = createContext()
const TeamProfileTabs = {
	HOME: "Home",
	ROSTER: "Roster",
	APPLY: "Apply",
}

async function checkForTeamAccount(setLoggedInUserAccountData) {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)
	const accountData = await getProfileDataWithToken(token)

	setLoggedInUserAccountData(accountData)
}

function onApplyButtonClicked(navigate, loggedInUserAccountData, accountData) {
	return function() {
	console.log(loggedInUserAccountData.id, accountData.accountId)

		navigate(`/apply/${loggedInUserAccountData.id}`)
	createApplication(loggedInUserAccountData.id, accountData.accountId)

	}
}

function ApplyButton({loggedInUserAccountData, accountData}) {
	if (!loggedInUserAccountData) return null

	const navigate = useNavigate()
	return <button onClick={onApplyButtonClicked(navigate, loggedInUserAccountData, accountData)}>Apply</button>
}

export default function TeamProfile({ isLoading, accountData }) {
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	const [description, setDescription] = useState(
		accountData.description || defaultProfileInfo
	)
	const [overview, setOverview] = useState(accountData.overview || defaultProfileInfo)
	const [selectedTab, setSelectedTab] = useState(TeamProfileTabs.HOME)
	const [loggedInUserAccountData, setLoggedInUserAccountData] = useState(null)

	useEffect(() => {
		checkForTeamAccount(setLoggedInUserAccountData)
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
							<p className="profile-title-text">{`${description}`}</p>
						</div>
						<p className="profile-location">📍 {accountData.location}</p>
					</div>
					<div>
						<div>
							<button>Home</button>
							<button>Roster</button>
							{loggedInUserAccountData && <ApplyButton loggedInUserAccountData={loggedInUserAccountData} accountData={accountData}/>}
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
