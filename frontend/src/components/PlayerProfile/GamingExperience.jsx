import { useState, useEffect } from "react"
import { GameOptions } from "../../utils/globalUtils"

/**
 * Code taken from stackoverflow -- https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
 */
function formatNumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function GameInformation({ gameName, gamePerformanceData, gameUsername }) {
	const performanceMetric = gameName == GameOptions.FORTNITE ? "K/D" : "Elo"
	const iconSource = `/${gameName}_Icon.png`

	return (
		<div className="profile-gaming-game">
			<img src={iconSource} className="profile-gaming-icon" />
			<div className="profile-gaming-information">
                <div className="profile-gaming-information-text">
				<h3>{gameName}</h3>
				<h4>{gameUsername}</h4>
                </div>
				<div className="profile-gaming-performance">
					<p>
						{performanceMetric}: {formatNumberWithCommas(gamePerformanceData.elo)}
					</p>
					<p>Kills: {formatNumberWithCommas(gamePerformanceData.kills)}</p>
					<p>Wins: {formatNumberWithCommas(gamePerformanceData.wins)}</p>
				</div>
			</div>
		</div>
	)
}

export default function GamingExperience({ accountData }) {
	const [displayedGames, setDisplayedGames] = useState([])

	useEffect(() => {
		const games = Object.keys(accountData.games).map((gameName) => (
			<GameInformation
				key={gameName}
				gameName={gameName}
				gamePerformanceData={accountData.games[gameName]}
                gameUsername={accountData.gameUsernames[gameName]}
			/>
		))
		setDisplayedGames(games)
	}, [])
	return <div className="profile-gaming-container">{displayedGames}</div>
}
