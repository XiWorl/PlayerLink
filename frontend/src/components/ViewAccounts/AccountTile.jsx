import { AccountType } from "../../utils/globalUtils"
import { ConnectPageContext } from "../../pages/ConnectPage"
import { useContext } from "react"
import { redirectToAccountProfile } from "./utils"
const defaultProfileInfo = ""

export default function AccountTile({ accountInformation }) {
	const { selectedAccountType, navigate } = useContext(ConnectPageContext)
	const selectedHiringClassName = accountInformation.currentlyHiring
		? "hiring"
		: "not-hiring"

	const accountDisplay =
		selectedAccountType == AccountType.TEAM ? (
			<div
				className="account"
				key={accountInformation.accountId}
				onClick={redirectToAccountProfile(
					accountInformation,
					AccountType.TEAM,
					navigate
				)}
			>
				<div className="view-profile-picture"></div>
				<div className="view-details">
					<h2>{accountInformation.name}</h2>
					<div className="account-information">
						<h3>{`${accountInformation.description || defaultProfileInfo} • ${
							accountInformation.location
						}`}</h3>
						<div className="account-information-hiring">
							<div className={selectedHiringClassName}></div>
							<h4 className={selectedHiringClassName}>
								{accountInformation.currentlyHiring
									? "Hiring"
									: "No Open Positions"}
							</h4>
						</div>
					</div>
				</div>
			</div>
		) : (
			<div
				className="account"
				key={accountInformation.accountId}
				onClick={redirectToAccountProfile(
					accountInformation,
					AccountType.PLAYER,
					navigate
				)}
			>
				<div className="view-profile-picture"></div>
				<div className="view-details">
					<h2>{`${accountInformation.firstName} ${accountInformation.lastName}`}</h2>
					<div className="account-information">
						<h3>{accountInformation.bio}</h3>
					</div>
				</div>
			</div>
		)

	return accountDisplay
}
