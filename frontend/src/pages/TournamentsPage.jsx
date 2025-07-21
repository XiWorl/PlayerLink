import { createContext, useState, useEffect } from "react"
import { getAllTournaments } from "../api"
import { CreateTournamentButton } from "../components/Tournaments/TournamentPageButtonComponents"
import Navbar from "../components/Navbar/Navbar"
import "../components/Tournaments/TournamentsPage.css"

export const TournamentContext = createContext()

async function getTournaments(setTournaments) {
	const tournamentData = await getAllTournaments()
	setTournaments(tournamentData)
}

export default function TournamentsPage() {
	const [tournaments, setTournaments] = useState([])
	const [isLoading, setIsLoading] = useState(false)

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
                <CreateTournamentButton />
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
