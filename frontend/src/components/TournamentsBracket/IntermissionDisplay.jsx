import Navbar from "../Navbar/Navbar"
function StartButton() {
	return <button className="tournament-start-btn">Start Tournament</button>
}

export default function IntermissionDisplay({ tournamentInformation }) {
	if (tournamentInformation == null) return
	const allParticipants = tournamentInformation.allParticipants
	const minimumParticipants = tournamentInformation.minimumParticipants
	const numberOfParticipants = Object.keys(allParticipants).length
	const canStartTournament = numberOfParticipants == minimumParticipants
	console.log(tournamentInformation)

	return (
		<>
			<Navbar />
			<div className="tournament-intermission">
				<div className="tournament-intermission-information">
					<h1>{`${numberOfParticipants}/${minimumParticipants} Participants`}</h1>
					{canStartTournament && <StartButton />}
				</div>

				<div className="tournament-intermission-teams">
					{Object.values(allParticipants).map((teamInformation) => {
						return (
							<div className="post" onClick={() => console.log("click")}>
								<div className="apply-profile-picture"></div>
								<div className="apply-details">
									<h2>{teamInformation.name}</h2>
									<div className="post-information">
										<h3>{teamInformation.description}</h3>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}
