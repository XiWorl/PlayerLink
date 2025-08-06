import { AccountType } from "../../utils/globalUtils"
import { ConnectPageContext } from "../../pages/ConnectPage"
import { useContext } from "react"
import { redirectToAccountProfile } from "./utils"

export default function AccountTile({ accountInformation }) {
	const { selectedAccountType, navigate } = useContext(ConnectPageContext)
	const selectedHiringClassName = accountInformation.currentlyHiring
		? "hiring"
		: "not-hiring"

	let teamDescription = accountInformation.description
	if (teamDescription == null) {
		teamDescription = ""
	} else {
		teamDescription = teamDescription + " • "
	}

	let accountName = ""
	if (selectedAccountType == AccountType.TEAM) {
		accountName = accountInformation.name || ""
	} else {
		accountName = `${accountInformation.firstName} ${accountInformation.lastName}`
	}

	const accountDisplay = (
		<div
			className="account"
			key={accountInformation.accountId}
			onClick={redirectToAccountProfile(
				accountInformation,
				selectedAccountType,
				navigate
			)}
		>
			<div className="view-profile-picture">
				{accountName.charAt(0).toUpperCase()}
			</div>
			<div className="view-details">
				<h2>
					{selectedAccountType == AccountType.TEAM
						? accountInformation.name
						: `${accountInformation.firstName} ${accountInformation.lastName}`}
				</h2>
				<div className="account-information">
					<h3>
						{selectedAccountType == AccountType.TEAM
							? `${teamDescription} ${accountInformation.location}`
							: accountInformation.bio || ""}
					</h3>
					{selectedAccountType == AccountType.TEAM && (
						<div className="account-information-hiring">
							<div className={selectedHiringClassName}></div>
							<h4 className={selectedHiringClassName}>
								{accountInformation.currentlyHiring
									? "Hiring"
									: "No Open Positions"}
							</h4>
						</div>
					)}
				</div>
			</div>
		</div>
	)

	return accountDisplay
}
