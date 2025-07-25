import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
	BASEURL,
	getAccountDataFromSessionStorage,
	AccountType,
} from "../../utils/globalUtils"
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

async function joinTournament(tournamentInformation) {
	try {
		const response = await fetch(`${BASEURL}/tournaments/join/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				teamAccountId: teamAccountId,
				tournamentId: tournamentInformation.tournamentId,
			}),
		})
		await response.json()
	} catch (error) {
		console.error("Error retrieving profile data:", error)
	}
}

function verifyUserIsLoggedIn(navigate, loggedInAccount) {
	if (!loggedInAccount || !loggedInAccount.id || !loggedInAccount.accountType) {
		navigate("/")
	}
}

export default function IntermissionDisplay({ tournamentInformation, setIsLoading }) {
	if (tournamentInformation == null) return

	const navigate = useNavigate()
	const allParticipants = tournamentInformation.allParticipants
	const minimumParticipants = tournamentInformation.minimumParticipants
	const numberOfParticipants = Object.keys(allParticipants).length
	const loggedInAccount = getAccountDataFromSessionStorage()

	useEffect(() => {
		verifyUserIsLoggedIn(navigate, loggedInAccount)
	}, [])

	const canStartTournament = numberOfParticipants >= minimumParticipants
	const isTournamentCreator =true
		//tournamentInformation.creatorAccountId === loggedInAccount.accountId

	return (
		<>
			<Navbar />
			<div className="tournament-intermission">
				<div className="tournament-intermission-information">
					<h1>{`${numberOfParticipants}/${minimumParticipants} Participants`}</h1>
					{canStartTournament && isTournamentCreator && (
						<button
							className="tournament-start-btn"
							onClick={() =>
								startTournament(tournamentInformation, setIsLoading)
							}
						>
							Start Tournament
						</button>
					)}
					{!canStartTournament &&
						!isTournamentCreator &&
						loggedInAccount.accountType == AccountType.TEAM && (
							<button
								className="tournament-start-btn"
								onClick={() => joinTournament(tournamentInformation)}
							>
								Join Tournament
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
