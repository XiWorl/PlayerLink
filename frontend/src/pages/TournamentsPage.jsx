import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllTournaments } from "../api"
import { CreateTournamentButton } from "../components/Tournaments/TournamentPageButtonComponents"
import { AccountType, getAccountDataFromSessionStorage } from "../utils/globalUtils"
import Navbar from "../components/Navbar/Navbar"
import "../components/Tournaments/TournamentsPage.css"

export const TournamentContext = createContext()

async function getTournaments(setTournaments) {
	const tournamentData = await getAllTournaments()
	setTournaments(tournamentData)
}

export default function TournamentsPage() {
	const navigate = useNavigate()
	const [tournaments, setTournaments] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const sessionStorageAccountData = getAccountDataFromSessionStorage()
	const accountType = sessionStorageAccountData.accountType
	const accountId = sessionStorageAccountData.id
	if (!sessionStorageAccountData || !accountId || !accountType) {
		navigate("/")
	}

	useEffect(() => {
		getTournaments(setTournaments)
	}, [])

	if (tournaments.length === 0) {
		return (
			<>
				<Navbar />
				<div className="tournament-tile centered">
					<h2>No Active Tournaments At This Time</h2>
				</div>
				{accountType == AccountType.TEAM && (
					<CreateTournamentButton teamAccountId={accountId} />
				)}
			</>
		)
	}

	return (
		<TournamentContext.Provider value={{ tournaments }}>
			<Navbar />
			<div className="tournaments-page">
				<div className="tournaments-container">
					<div className="tournament-tile">
						<h2>Tournament Name</h2>
					</div>
				</div>
			</div>
		</TournamentContext.Provider>
	)
}
