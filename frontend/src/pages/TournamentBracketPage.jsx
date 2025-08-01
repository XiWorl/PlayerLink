import { useState, useEffect, createContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getTournament } from "../api"
import { MatchupTile } from "../components/TournamentsBracket/MatchupTile"
import { createNextRoundArray } from "../components/TournamentsBracket/BracketUtils"
import IntermissionDisplay from "../components/TournamentsBracket/IntermissionDisplay"
import RoundSelectionButton from "../components/TournamentsBracket/RoundSelectionButton"
import Navbar from "../components/Navbar/Navbar"
import "../components/TournamentsBracket/BracketPage.css"

export const TournamentContext = createContext()
const NEXT_ROUND_VALUE = 1

function EmptyTile() {
	return (
		<div className="matchup-tile">
			<div className="teams">
				<div className="empty-team">
					<h2>Match TBD</h2>
				</div>
				<div className="versus">
					<h2>VS</h2>
				</div>
				<div className="empty-team">
					<h2>Match TBD</h2>
				</div>
			</div>
		</div>
	)
}

function getTotalNumberOfMatchupsBasedOnRound(roundNumber) {
	const remainingTeamsInTournamentBasedOnRound = 16 / Math.pow(2, roundNumber)
	return remainingTeamsInTournamentBasedOnRound
}

async function loadTournamentInformation(
	setTournamentInformation,
	id,
	setDisplayedMatchups
) {
	const tournamentInformation = await getTournament(id)
	setTournamentInformation(tournamentInformation)

	if (tournamentInformation.isActive == true) {
		setDisplayedMatchups(tournamentInformation.rounds.round1)
	}
}

export function BracketPage() {
	const [tournamentInformation, setTournamentInformation] = useState(null)
	const [displayedMatchups, setDisplayedMatchups] = useState([])
	const [emptyMatchups, setEmptyMatchups] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [rounds, setRounds] = useState(1)
	const { id } = useParams()

	useEffect(() => {
		loadTournamentInformation(setTournamentInformation, id, setDisplayedMatchups)
	}, [isLoading])

	if (!isLoading && displayedMatchups.length == 0 && rounds == 1) {
		return (
			<IntermissionDisplay
				setIsLoading={setIsLoading}
				tournamentInformation={tournamentInformation}
			/>
		)
	}

	let numberOfEmptyMatchups =
		getTotalNumberOfMatchupsBasedOnRound(rounds) - displayedMatchups.length

	if (rounds == tournamentInformation.currentRound + NEXT_ROUND_VALUE) {
		numberOfEmptyMatchups =
			getTotalNumberOfMatchupsBasedOnRound(rounds) -
			createNextRoundArray(tournamentInformation).length
	}

	if (emptyMatchups.length != 0) {
		setEmptyMatchups([])
	}

	for (let i = 0; i < numberOfEmptyMatchups; i++) {
		emptyMatchups.push(<EmptyTile />)
	}

	return (
		<>
			<Navbar />
			<div className="bracket-page">
				<div className="rounds-header">
					{Object.keys(tournamentInformation.rounds).map((round, index) => {
						return (
							<RoundSelectionButton
								key={index}
								roundNumber={index + NEXT_ROUND_VALUE}
								setRound={setRounds}
								tournamentInformation={tournamentInformation}
								setDisplayedMatchups={setDisplayedMatchups}
								setEmptyMatchups={setEmptyMatchups}
							/>
						)
					})}
				</div>

				<div className="matchups">
					{rounds == tournamentInformation.currentRound + NEXT_ROUND_VALUE &&
						createNextRoundArray(tournamentInformation).map(
							(matchup, index) => {
								return (
									<MatchupTile
										key={index}
										matchup={matchup}
										tournamentInformation={tournamentInformation}
										round={rounds}
										setTournamentInformation={
											setTournamentInformation
										}
									/>
								)
							}
						)}

					{rounds != tournamentInformation.currentRound + NEXT_ROUND_VALUE &&
						displayedMatchups.map((matchup, index) => {
							return (
								<MatchupTile
									key={index}
									matchup={matchup}
									tournamentInformation={tournamentInformation}
									round={rounds}
									setTournamentInformation={setTournamentInformation}
								/>
							)
						})}
					{emptyMatchups.map((index) => {
						return <EmptyTile />
					})}
				</div>
			</div>
		</>
	)
}
