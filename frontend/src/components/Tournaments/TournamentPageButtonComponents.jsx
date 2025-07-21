import { createNewTournament } from "../../api"

export function CreateTournamentButton({ teamAccountId }) {
	return (
		<div className="button-holder">
			<button
				className="create-tournament-btn"
				onClick={() => createNewTournament(teamAccountId)}
			>
				Create Tournament
			</button>
		</div>
	)
}

export function JoinTournament() {}

export function NoActiveTournaments() {}
