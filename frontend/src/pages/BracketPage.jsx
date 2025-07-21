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

export default function BracketPage() {
	return (
		<div className="bracket-page">
			<div className="rounds-header">
				<button className="round-btn">Round</button>
				<button className="round-btn">Round</button>
				<button className="round-btn">Round</button>
			</div>

			<div className="matchups">
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
			</div>
		</div>
	)
}
