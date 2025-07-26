import { useContext } from "react"
import { createNewTournament } from "../../api"
import { TournamentContext } from "../../pages/TournamentsPage"

export function CreateTournamentButton({ teamAccountId, email }) {
	const { setTournaments, tournaments } = useContext(TournamentContext)

	return (
		<div className="button-holder">
			<button
				className="create-tournament-btn"
				onClick={async () => {
					const data = await createNewTournament(teamAccountId, email)
					setTournaments([...tournaments, data])
				}}
			>
				Create Tournament
			</button>
		</div>
	)
}
