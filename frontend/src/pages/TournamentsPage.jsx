import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllTournaments } from "../api"
import { CreateTournamentButton } from "../components/Tournaments/CreateTournamentButton"
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

	const sessionStorageAccountData = getAccountDataFromSessionStorage()
	if (!sessionStorageAccountData) {
		navigate("/")
	}

	const accountType = sessionStorageAccountData.accountType
	const accountId = sessionStorageAccountData.id
	const email = sessionStorage.getItem(GOOGLE_EMAIL_KEY)

	if (!accountId || !accountType || !email) {
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

	const tournamentTiles = tournaments.map((tournament) => {
		return <TournamentTile key={tournament.id} tournamentInformation={tournament} />
	})

	tournamentTiles.sort((a, b) => {
		const aDate = new Date(a.props.tournamentInformation.createdAt)
		const bDate = new Date(b.props.tournamentInformation.createdAt)
		return bDate - aDate
	})

	return (
		<TournamentContext.Provider value={{ tournaments, setTournaments }}>
			<Navbar />
			<div className="tournaments-page">
				<div className="tournaments-container">
					{tournamentTiles}
					{accountType == AccountType.TEAM && (
						<CreateTournamentButton teamAccountId={accountId} email={email} />
					)}
				</div>
			</div>
		</TournamentContext.Provider>
	)
}
