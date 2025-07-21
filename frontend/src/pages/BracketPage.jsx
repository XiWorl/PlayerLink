import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getTournament } from "../api"
import TournamentLoading from "../components/Tournaments/TournamentLoading"
import Navbar from "../components/Navbar/Navbar"
import "../components/Tournaments/BracketPage.css"

function EmptyTeam() {
	return <div className="empty-team"></div>
}

function AdvanceButton() {
	return (
		<div className="advance-div">
			<button className="advance-btn">Advance</button>
		</div>
	)
}

function MatchupTile({matchup}) {
	console.log(matchup)
	return (
		<div className="matchup-tile">
			<div className="teams">
				<div className="team 1">
					<h2>Team1 Name</h2>
				</div>
				<div className="versus">
					<h2>VS</h2>
				</div>
				<div className="team 2">
					<h2>Team2 Name</h2>
				</div>
			</div>
		</div>
	)
}

async function loadTournamentInformation(setTournamentInformation, id) {
	const tournamentInformation = await getTournament(id)
	setTournamentInformation(tournamentInformation)
	console.log(tournamentInformation)
}

export default function BracketPage() {
	const [tournamentInformation, setTournamentInformation] = useState(null)
	const [displayedMatchups, setDisplayedMatchups] = useState([])
	const [rounds, setRounds] = useState({})
	const { id } = useParams()

	useEffect(() => {
		loadTournamentInformation(setTournamentInformation, id)
	}, [])

	// return <TournamentLoading tournamentInformation={tournamentInformation}/>

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
						return <MatchupTile key={index} matchup={matchup}/>
					})}
				</div>
			</div>
		</>
	)
}
