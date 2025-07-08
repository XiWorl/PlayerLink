import { useState, useEffect } from "react"
import { AccountType } from "../../utils/globalUtils"
import { getApplicationsFromAccountId, getProfileData } from "../../api"
import "./ApplyPage.css"

function Sidebar({ accountType }) {
	const buttonText =
		accountType === AccountType.PLAYER ? "My Applications" : "View Applications"
	return (
		<div className="sidebar">
			<div className="sidebar-options">
				<button className="sidebar-options-btn">{buttonText}</button>
			</div>
		</div>
	)
}

async function createApplicationPost(applicationData) {
    const info = await getProfileData(AccountType.TEAM, applicationData.teamAccountId)
	return (
		<div className="post" key={applicationData.applicationId}>
			<div className="apply-profile-picture"></div>
			<div className="apply-details">
				<h2>{info.name}</h2>
				<div className="post-information">
					<h3>{info.description}</h3>
					<button>{applicationData.status}</button>
				</div>
			</div>
		</div>
	)
}

function EmptyApplications() {
	return (
		<div className="empty-applications">
			<h2>No applications found</h2>
		</div>
    )
}

async function loadApplications(accountId, setApplicationsDisplay) {
	const applications = await getApplicationsFromAccountId(accountId)

    if (applications.length === 0) {
        setApplicationsDisplay(<EmptyApplications />)
        return
    }

	const newApplicationsDisplay = applications.map((application) => createApplicationPost(application))
    setApplicationsDisplay(newApplicationsDisplay)
}

export function Applications({ accountData, accountId }) {
	const [applicationsDisplay, setApplicationsDisplay] = useState([])

	useEffect(() => {
		loadApplications(accountId, setApplicationsDisplay)
	}, [])

	return (
		<div className="apply-page">
			<div className="page-content">
				<Sidebar accountType={accountData.accountType} />
				<div className="postings">{applicationsDisplay}</div>
			</div>
		</div>
	)
}
