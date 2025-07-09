import { useState, useEffect } from "react"
import { getApplicationsFromAccountId } from "../../api"
import { Sidebar, createApplicationTile } from "./Utils"
import "./ApplyPage.css"

function EmptyApplicationsDisplay() {
	return (
		<div className="empty-applications">
			<h2>No applications found</h2>
		</div>
    )
}

async function loadApplications(accountId, setApplicationsDisplay) {
	const applications = await getApplicationsFromAccountId(accountId)

    if (applications.length === 0) {
        setApplicationsDisplay(<EmptyApplicationsDisplay />)
        return
    }

	const newApplicationsDisplay = applications.map((applicationData) => createApplicationTile(applicationData))
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
