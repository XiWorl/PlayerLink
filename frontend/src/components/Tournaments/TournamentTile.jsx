export function TournamentTile({ tournamentInformation, onClick }) {
	const tournamentCreatorAccountId = tournamentInformation.creatorAccountId
	const tournamentCreaterInformation = tournamentInformation.allParticipants[tournamentCreatorAccountId]
	return (
		<div className="tournament-tile pointer">
			<h2>{tournamentInformation.name}</h2>
			{tournamentCreaterInformation && <p>Created by: {tournamentCreaterInformation.name}</p>}
		</div>
	)
}
