import { useState, useEffect } from "react"
import { BASEURL, AccountType } from "../utils/globalUtils"
import Navbar from "../components/Navbar/Navbar"
import PageSelector from "../components/ViewAccounts/PageSelector"
import "../components/TeamApplication/ViewAccounts.css"

function createAccountDisplay(accountInformation, accountType) {
	const selectedHiringClassName = accountInformation.currentlyHiring
		? "hiring"
		: "not-hiring"

	const accountDisplay =
		accountType == AccountType.TEAM ? (
			<div className="account" key={accountInformation.accountId}>
				<div className="view-profile-picture"></div>
				<div className="view-details">
					<h2>{accountInformation.name}</h2>
					<div className="account-information">
						<h3>{`${accountInformation.description} • ${accountInformation.location}`}</h3>
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
			<div className="account" key={accountInformation.accountId}>
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

async function loadPage(page, accountType, setTotalPages, setDisplay) {
	try {
		const response = await fetch(
			`${BASEURL}/collection/${accountType}s/?page=${page}`
		)
		const data = await response.json()

		setTotalPages(data.totalPages)
		setDisplay(data.data.map((account) => createAccountDisplay(account, accountType)))
	} catch (error) {
		console.error("Error retrieving data:", error)
	}
}

function onAccountTypeChange(accountType, setPage, setSelectedAccountType) {
	return function () {
		setPage(1)
		setSelectedAccountType(accountType)
	}
}

export default function ViewAccountsPage() {
	const [display, setDisplay] = useState([])
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [selectedAccountType, setSelectedAccountType] = useState(AccountType.TEAM)

	useEffect(() => {
		loadPage(page, selectedAccountType, setTotalPages, setDisplay)
	}, [page, selectedAccountType])

	return (
		<>
			<Navbar />
			<div className="view-page">
				<div className="header">
					<div className="view-players">
						<button
							className="view-players-btn"
							onClick={onAccountTypeChange(
								AccountType.PLAYER,
								setPage,
								setSelectedAccountType
							)}
						>
							View Players
						</button>
					</div>
					<div className="view-teams">
						<button
							className="view-teams-btn"
							onClick={onAccountTypeChange(
								AccountType.TEAM,
								setPage,
								setSelectedAccountType
							)}
						>
							View Teams
						</button>
					</div>
				</div>
				<div className="page-content">
					<div className="accounts">{display}</div>
				</div>
			</div>
			<PageSelector page={page} setPage={setPage} totalPages={totalPages} />
		</>
	)
}
