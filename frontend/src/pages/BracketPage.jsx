import { useState, useEffect, createContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getTournament } from "../api"
import IntermissionDisplay from "../components/TournamentsBracket/IntermissionDisplay"
import TournamentLoading from "../components/Tournaments/TournamentLoading"
import Navbar from "../components/Navbar/Navbar"
import "../components/Tournaments/BracketPage.css"

export const TournamentContext = createContext()

function EmptyTeam() {
	return <div className="empty-team"></div>
}

function RoundButton() {
	return (
<button className="round-btn">Round</button>
	)
}

function AdvanceButton() {
	return (
		<div className="advance-div">
			<button className="advance-btn">Advance</button>
		</div>
	)
}

function MatchupTile({ matchup }) {
	console.log(matchup)
	const navigate = useNavigate()
	return (
		<div className="matchup-tile">
			<div className="teams">
				<div
					className="team 1"
					onClick={() => navigate(`/teams/${matchup.team1.accountId}`)}
				>
					<h2>{matchup.team1.name}</h2>
				</div>
				<div className="versus">
					<h2>VS</h2>
				</div>
				<div
					className="team 2"
					onClick={() => navigate(`/teams/${matchup.team2.accountId}`)}
				>
					<h2>{matchup.team2.name}</h2>
				</div>
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
		console.log("round 1", tournamentInformation.rounds.round1)
		console.log(tournamentInformation.rounds.round1.length)
	}
}

export function BracketPage() {
	const [tournamentInformation, setTournamentInformation] = useState(null)
	const [displayedMatchups, setDisplayedMatchups] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [rounds, setRounds] = useState(1)
	const { id } = useParams()

	useEffect(() => {
		loadTournamentInformation(setTournamentInformation, id, setDisplayedMatchups)
	}, [isLoading, rounds])

	if (isLoading && displayedMatchups.length == 0) {
		return <TournamentLoading tournamentInformation={tournamentInformation} />
	} else if (!isLoading && displayedMatchups.length == 0) {
		return (
			<TournamentContext.Provider value={{ isLoading, setIsLoading }}>
				<IntermissionDisplay tournamentInformation={tournamentInformation} />
			</TournamentContext.Provider>
		)
	}

	return (
		<>
			<Navbar />
			<div className="bracket-page">
				<div className="rounds-header">
					<button className="round-btn">Round</button>
					<button className="round-btn">Round</button>
					<button className="round-btn">Round</button>
				</div>

				<div className="matchups">
					{displayedMatchups.map((matchup, index) => {
						return <MatchupTile key={index} matchup={matchup} />
					})}
				</div>
			</div>
		</>
	)
}
