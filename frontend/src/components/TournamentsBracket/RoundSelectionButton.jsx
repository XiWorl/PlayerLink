export default function RoundButton({
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
