import Navbar from "../Navbar/Navbar"
import "./TournamentLoading.css"

export default function TournamentLoading({ tournamentInformation }) {
	if (!tournamentInformation) return null
	const name = tournamentInformation.name
	const participants = Object.keys(tournamentInformation.allParticipants).length
	const minimumParticipants = tournamentInformation.minimumParticipants
    
	return (
		<>
			<Navbar />
			<div className="tournament-loading">
				<h1>{name}</h1>
				<h2>{`${participants}/${minimumParticipants} Participants`}</h2>
				<h3>{`${minimumParticipants} participants are needed to start the tournament`}</h3>
				<button>Join Tournament</button>
			</div>
		</>
	)
}
