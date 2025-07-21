import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllTournaments } from "../api"
import { CreateTournamentButton } from "../components/Tournaments/TournamentPageButtonComponents"
import { TournamentTile } from "../components/Tournaments/TournamentTile"
import {
	AccountType,
	getAccountDataFromSessionStorage,
	GOOGLE_EMAIL_KEY,
} from "../utils/globalUtils"
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
	const email = sessionStorage.getItem(GOOGLE_EMAIL_KEY)
	if (!sessionStorageAccountData || !accountId || !accountType || !email) {
		navigate("/")
	}

	useEffect(() => {
		getTournaments(setTournaments)
	}, [])

	if (tournaments.length === 0) {
		return (
			<TournamentContext.Provider value={{ tournaments, setTournaments }}>
				<Navbar />
				<div className="tournament-tile centered">
					<h2>No Active Tournaments At This Time</h2>
				</div>
				{accountType == AccountType.TEAM && (
					<CreateTournamentButton teamAccountId={accountId} email={email} />
				)}
			</TournamentContext.Provider>
		)
	}

	return (
		<TournamentContext.Provider value={{ tournaments, setTournaments }}>
			<Navbar />
			<div className="tournaments-page">
				<div className="tournaments-container">
					{tournaments.map((tournament) => {
						return (
							<TournamentTile
								key={tournament.id}
								tournamentInformation={tournament}
							/>
						)
					})}
					{accountType == AccountType.TEAM && (
						<CreateTournamentButton teamAccountId={accountId} email={email} />
					)}
				</div>
			</div>
		</TournamentContext.Provider>
	)
}
