import { useState, useEffect, createContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getTournament } from "../api"
import IntermissionDisplay from "../components/TournamentsBracket/IntermissionDisplay"
import TournamentLoading from "../components/Tournaments/TournamentLoading"
import Navbar from "../components/Navbar/Navbar"
import "../components/Tournaments/BracketPage.css"

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

function AdvanceButton({ accountId }) {
	return (
		<div className="advance-div">
			<button className="advance-btn">Advance</button>
		</div>
	)
}

function MatchupTile({ matchup }) {
	const navigate = useNavigate()
	let team2 = matchup.team2

	if (team2 == null) {
		team2 = (
			<div className="empty-team">
				<h2>Match TBD</h2>
			</div>
		)
	} else {
		team2 = (
			<div
				className="team 2"
				onClick={() => navigate(`/teams/${matchup.team2.accountId}`)}
			>
				<AdvanceButton accountId={matchup.team2.accountId} />
				<h2>{matchup.team2.name}</h2>
			</div>
		)
	}
	return (
		<div className="matchup-tile">
			<div className="teams">
				<div
					className="team 1"
					onClick={() => navigate(`/teams/${matchup.team1.accountId}`)}
				>
					<AdvanceButton accountId={matchup.team1.accountId} />
					<h2>{matchup.team1.name}</h2>
				</div>
				<div className="versus">
					<h2>VS</h2>
				</div>
				{team2}
			</div>
		</div>
	)
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

	if (isLoading && displayedMatchups.length == 0) {
		return <TournamentLoading tournamentInformation={tournamentInformation} />
	} else if (!isLoading && displayedMatchups.length == 0 && rounds == 1) {
		return (
			<TournamentContext.Provider value={{ isLoading, setIsLoading }}>
				<IntermissionDisplay tournamentInformation={tournamentInformation} />
			</TournamentContext.Provider>
		)
	}

	const numberOfEmptyMatchups =
		getTotalNumberOfMatchupsBasedOnRound(rounds) - displayedMatchups.length
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
					{displayedMatchups.map((matchup, index) => {
						return <MatchupTile key={index} matchup={matchup} />
					})}
					{emptyMatchups.map((index) => {
						return <EmptyTile />
					})}
				</div>
			</div>
		</>
	)
}
