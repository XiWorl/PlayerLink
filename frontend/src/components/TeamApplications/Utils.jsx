import { getProfileData } from "../../api"
import { AccountType } from "../../utils/globalUtils"

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

export async function fetchProfileInformation(
	accountType,
	accountId,
	setProfileInformation
) {
	const profileData = await getProfileData(accountType, accountId)
	setProfileInformation(profileData)
}
