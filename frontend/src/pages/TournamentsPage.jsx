import { createContext, useState } from "react"
import Navbar from "../components/Navbar/Navbar"
import "../components/Tournaments/TournamentsPage.css"

export const TournamentContext = createContext()

export default function TournamentsPage() {
	const [tournaments, setTournaments] = useState([])
	const [isLoading, setIsLoading] = useState(false)

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
