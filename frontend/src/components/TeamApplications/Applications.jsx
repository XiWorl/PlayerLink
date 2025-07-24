import { useState, useEffect } from "react"
import { getApplicationsFromAccountId } from "../../api"
import { Sidebar } from "./Utils.jsx"
import { ApplicationTile } from "./ApplicationTile.jsx"
import { Recommendations } from "./Recommendations.jsx"
import "./ApplyPage.css"

const TABS = {
	APPLICATIONS: "Applications",
	RECOMMENDATIONS: "Recommendations",
}

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

	const newApplicationsDisplay = applications.map((applicationData) => (
		<ApplicationTile applicationData={applicationData} />
	))
	setApplicationsDisplay(newApplicationsDisplay)
}

export function Applications({ accountData, accountId }) {
	const [applicationsDisplay, setApplicationsDisplay] = useState([])
	const [currentTab, setCurrentTab] = useState(TABS.APPLICATIONS)

	useEffect(() => {
		loadApplications(accountId, setApplicationsDisplay)
	}, [])

	return (
		<div className="apply-page">
			{currentTab === TABS.APPLICATIONS && (
				<div className="page-content">
					<Sidebar
						accountType={accountData.accountType}
						setCurrentTab={setCurrentTab}
					/>
					<div className="postings">{applicationsDisplay}</div>
				</div>
			)}
			{currentTab === TABS.RECOMMENDATIONS && accountData != null && (
				<div className="page-content">
					<Sidebar
						accountType={accountData.accountType}
						setCurrentTab={setCurrentTab}
					/>
					<Recommendations accountId={accountId} />
				</div>
			)}
		</div>
	)
}
