import { useState, useEffect, createContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getTournament } from "../api"
import { MatchupTile } from "../components/TournamentsBracket/MatchupTile"
// import { createNextRoundArray } from "../components/TournamentsBracket/NextRoundBracket"
import IntermissionDisplay from "../components/TournamentsBracket/IntermissionDisplay"
import Navbar from "../components/Navbar/Navbar"
import "../components/TournamentsBracket/BracketPage.css"

export const TournamentContext = createContext()

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

function RoundButton({
	roundNumber,
	setRound,
	tournamentInformation,
	setDisplayedMatchups,
	setEmptyMatchups,
}) {
	return (
		<button
			className="round-btn"
			onClick={() => {
				setRound(roundNumber)
				setDisplayedMatchups(tournamentInformation.rounds[`round${roundNumber}`])
				setEmptyMatchups([])
			}}
		>
			Round {roundNumber}
		</button>
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
    console.log(tournamentInformation)
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
			// <TournamentContext.Provider value={{ setIsLoading, tournamentInformation }}>
				<IntermissionDisplay setIsLoading={setIsLoading} tournamentInformation={tournamentInformation}/>
			// </TournamentContext.Provider>
		)
	}

	let numberOfEmptyMatchups =
		getTotalNumberOfMatchupsBasedOnRound(rounds) - displayedMatchups.length

	if (rounds == tournamentInformation.currentRound + 1) {
		numberOfEmptyMatchups =
			getTotalNumberOfMatchupsBasedOnRound(rounds) -
			createNextRoundArray(tournamentInformation).length
	}

	for (let i = 0; i < numberOfEmptyMatchups; i++) {
		emptyMatchups.push(<EmptyTile />)
	}

	console.log(tournamentInformation)

	return (
		<>
			<Navbar />
			<div className="bracket-page">
				<div className="rounds-header">
					{Object.keys(tournamentInformation.rounds).map((round, index) => {
						return (
							<RoundButton
								key={index}
								roundNumber={index + 1}
								setRound={setRounds}
								tournamentInformation={tournamentInformation}
								setDisplayedMatchups={setDisplayedMatchups}
								setEmptyMatchups={setEmptyMatchups}
							/>
						)
					})}
				</div>

				<div className="matchups">
					{rounds == tournamentInformation.currentRound + 1 &&
						createNextRoundArray(tournamentInformation).map(
							(matchup, index) => {
								console.log(matchup)
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

					{rounds != tournamentInformation.currentRound + 1 &&
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
