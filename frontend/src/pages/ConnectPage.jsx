import { useNavigate } from "react-router-dom"
import { useState, useEffect, createContext } from "react"
import { AccountType } from "../utils/globalUtils"
import Navbar from "../components/Navbar/Navbar"
import PageSelector from "../components/ViewAccounts/PageSelector"
import { loadPage } from "../components/ViewAccounts/utils"
export const ConnectPageContext = createContext()



export default function ConnectPage() {
	const initialPage = 1
	const [display, setDisplay] = useState([])
	const [page, setPage] = useState(initialPage)
	const [totalPages, setTotalPages] = useState(initialPage)
	const [selectedAccountType, setSelectedAccountType] = useState(AccountType.TEAM)
	const navigate = useNavigate()

	const viewPlayersButtonClassName = `view-players-btn ${
		selectedAccountType === AccountType.PLAYER ? "selected" : ""
	}`
	const viewTeamsButtonClassName = `view-teams-btn ${
		selectedAccountType === AccountType.TEAM ? "selected" : ""
	}`

	useEffect(() => {
		loadPage(selectedAccountType, page, setTotalPages, setDisplay)
	}, [page, selectedAccountType])

	return (
		<>
			<ConnectPageContext.Provider
				value={{
					display,
					setDisplay,
					navigate,
					selectedAccountType,
					setSelectedAccountType,
				}}
			>
				<Navbar />
				<div className="view-page">
					<div className="header">
						<div className="view-players">
							<button
								className={viewPlayersButtonClassName}
								onClick={() => {
									setPage(initialPage)
									setSelectedAccountType(AccountType.PLAYER)
								}}
							>
								View Players
							</button>
						</div>
						<div className="view-teams">
							<button
								className={viewTeamsButtonClassName}
								onClick={() => {
									setPage(initialPage)
									setSelectedAccountType(AccountType.TEAM)
								}}
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
			</ConnectPageContext.Provider>
		</>
	)
}
