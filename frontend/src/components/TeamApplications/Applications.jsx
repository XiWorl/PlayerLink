import { useState, useEffect } from "react"
import { getApplicationsFromAccountId } from "../../api"
import { createApplicationTile, SidebarTabs, Sidebar } from "./Utils"
import { AccountType } from "../../utils/globalUtils"
import { Recommendations } from "./Recommendations"
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

	const newApplicationsDisplay = applications.map((applicationData) =>
		createApplicationTile(applicationData)
	)
	setApplicationsDisplay(newApplicationsDisplay)
}

export function Applications({ accountData, accountId }) {
	const [applicationsDisplay, setApplicationsDisplay] = useState([])
	const [currentTab, setCurrentTab] = useState(SidebarTabs.APPLICATIONS)

	useEffect(() => {
		loadApplications(accountId, setApplicationsDisplay)
	}, [])

	return (
		<div className="apply-page">
			{currentTab === SidebarTabs.APPLICATIONS && (
				<div className="page-content">
					<Sidebar
						accountType={accountData.accountType}
						setCurrentTab={setCurrentTab}
					/>
					<div className="postings">{applicationsDisplay}</div>
				</div>
			)}
			{currentTab === SidebarTabs.RECOMMENDATIONS &&
				accountData != null &&
				accountData.accountType == AccountType.PLAYER && (
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
