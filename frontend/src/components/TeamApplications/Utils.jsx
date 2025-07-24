import { getProfileData } from "../../api"
import { AccountType } from "../../utils/globalUtils"

const TABS = {
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
					onClick={() => setCurrentTab(TABS.APPLICATIONS)}
				>
					{viewApplicationsButtonText}
				</button>
				{accountType === AccountType.PLAYER && (
					<button
						className="sidebar-options-btn"
						onClick={() => setCurrentTab(TABS.RECOMMENDATIONS)}
					>
						Suggested For You
					</button>
				)}
			</div>
		</div>
	)
}

export async function fetchProfileInformation(
	accountType,
	accountId,
	setProfileInformation
) {
	const profileData = await getProfileData(accountType, accountId)
	setProfileInformation(profileData)
}
