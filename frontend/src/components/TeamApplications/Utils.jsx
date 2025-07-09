import { getProfileData } from "../../api"
import { AccountType } from "../../utils/globalUtils"

export async function ApplicationTile({ applicationData }) {
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

export function Sidebar({ accountType }) {
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
