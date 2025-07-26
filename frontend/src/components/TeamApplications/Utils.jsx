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
