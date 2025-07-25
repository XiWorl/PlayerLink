import { useNavigate } from "react-router-dom"
export function TournamentTile({ tournamentInformation }) {
	const navigate = useNavigate()

	const tournamentCreatorAccountId = tournamentInformation.creatorAccountId
	const tournamentCreaterInformation = tournamentInformation.allParticipants[tournamentCreatorAccountId]

	return (
		<div className="tournament-tile pointer" onClick={() => navigate(`/tournaments/${tournamentInformation.tournamentId}`)}>
			<h2>{tournamentInformation.name}</h2>
			{tournamentCreaterInformation && <p>Created by: {tournamentCreaterInformation.name}</p>}
		</div>
	)
}
