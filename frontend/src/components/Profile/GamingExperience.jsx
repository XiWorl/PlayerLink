import { useState, useEffect } from "react"
import { GameOptions } from "../../utils/globalUtils"

function GameInformation({ gameName, gamePerformanceData }) {
	const performanceMetric = gameName == GameOptions.FORTNITE ? "K/D" : "Elo"
	const iconSource = `/public/${gameName}_Icon.png`

	return (
		<div className="profile-gaming-game">
			<img src={iconSource} className="profile-gaming-icon" />
			<div className="profile-gaming-information">
				<h4>{gameName}</h4>
				<div className="profile-gaming-performance">
					<p>
						{performanceMetric}: {gamePerformanceData.elo}
					</p>
					<p>Kills: {gamePerformanceData.kills}</p>
					<p>Wins: {gamePerformanceData.wins}</p>
				</div>
			</div>
		</div>
	)
}

export default function GamingExperience({ accountData }) {
	const [displayedGames, setDisplayedGames] = useState([])

	useEffect(() => {
        for (const game in accountData.games) {
            setDisplayedGames([...displayedGames, <GameInformation gameName={game} gamePerformanceData={accountData.games[game]} />])
		}
	}, [])
	return <div className="profile-gaming-container">{displayedGames}</div>
}
