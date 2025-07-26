import { getProfileData } from "../../api"
import { AccountType } from "../../utils/globalUtils"

export const SidebarTabs = {
	APPLICATIONS: "Applications",
	RECOMMENDATIONS: "Recommendations",
}

export function Sidebar({ accountType, setCurrentTab }) {
	const viewApplicationsButtonText =
		accountType === AccountType.PLAYER ? "My Applications" : "View Applications"

	return (
		<div className="sidebar">
			<div className="sidebar-options">
				<button
					className="sidebar-options-btn"
					onClick={() => setCurrentTab(SidebarTabs.APPLICATIONS)}
				>
					{viewApplicationsButtonText}
				</button>
				{accountType === AccountType.PLAYER && (
					<button
						className="sidebar-options-btn"
						onClick={() => setCurrentTab(SidebarTabs.RECOMMENDATIONS)}
					>
						Suggested For You
					</button>
				)}
			</div>
		</div>
	)
}

export async function createApplicationTile(applicationData) {
	const profileInformation = await getProfileData(AccountType.TEAM, applicationData.teamAccountId)

	return (
		<div className="post" key={applicationData.applicationId}>
			<div className="apply-profile-picture"></div>
			<div className="apply-details">
				<h2>{profileInformation.name}</h2>
				<div className="post-information">
					<h3>{profileInformation.description}</h3>
					<button>{applicationData.status}</button>
				</div>
			</div>
		</div>
	)
}
