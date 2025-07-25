import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { BASEURL } from "../../utils/globalUtils"
import { TournamentContext } from "../../pages/TournamentBracketPage"
import Navbar from "../Navbar/Navbar"

export const TournamentStateOptions = {
	INTERMISSION: "intermission",
	ACTIVE: "active",
}

async function startTournament(tournamentInformation, setIsLoading) {
	try {
		setIsLoading(true)
		const response = await fetch(
			`${BASEURL}/tournaments/start/${tournamentInformation.tournamentId}`
		)
		await response.json()
		setIsLoading(false)
	} catch (error) {
		console.error("Error retrieving profile data:", error)
	}
}

export default function IntermissionDisplay({ tournamentInformation }) {
	if (tournamentInformation == null) return
	const navigate = useNavigate()
	const { setIsLoading, isLoading } = useContext(TournamentContext)

	const allParticipants = tournamentInformation.allParticipants
	const minimumParticipants = tournamentInformation.minimumParticipants
	const numberOfParticipants = Object.keys(allParticipants).length
	const canStartTournament = numberOfParticipants >= minimumParticipants

    console.log(tournamentInformation)

	return (
		<>
			<Navbar />
			<div className="tournament-intermission">
				<div className="tournament-intermission-information">
					<h1>{`${numberOfParticipants}/${minimumParticipants} Participants`}</h1>
					{canStartTournament && (
						<button
							className="tournament-start-btn"
							onClick={() =>
								startTournament(
									tournamentInformation,
									setIsLoading
								)
							}
						>
							Start Tournament
						</button>
					)}
				</div>

				<div className="tournament-intermission-teams">
					{Object.values(allParticipants).map((teamInformation) => {
						return (
							<div
								className="post"
								onClick={() =>
									navigate(`/teams/${teamInformation.accountId}`)
								}
							>
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
