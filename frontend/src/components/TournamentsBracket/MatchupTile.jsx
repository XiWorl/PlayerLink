import { useNavigate, useParams } from 'react-router-dom'
import { BASEURL } from "../../utils/globalUtils"

async function advanceTeam(accountId, tournamentId, setTournamentInformation) {
    const response = await fetch(`${BASEURL}/tournaments/team/advance/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId: accountId, tournamentId: tournamentId }),
    })
    const updatedTournamentInformation = await response.json()
    setTournamentInformation(updatedTournamentInformation)
    return updatedTournamentInformation
}

function AdvanceButton({ accountId, setTournamentInformation }) {
    const { id } = useParams()
    return (
        <div className="advance-div">
            <button
                className="advance-btn"
                onClick={(event) => {
                    advanceTeam(accountId, id, setTournamentInformation)
                    event.stopPropagation()
                }}
            >
                Advance
            </button>
        </div>
    )
}

export function MatchupTile({
	matchup,
	tournamentInformation,
	round,
	setTournamentInformation,
}) {
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
				{!tournamentInformation.participantsAdvancedToNextRound[
					matchup.team2.accountId
				] &&
					round == tournamentInformation.currentRound &&
					round != 4 && !tournamentInformation.participantsAdvancedToNextRound[matchup.team1.accountId] && (
						<AdvanceButton
							accountId={matchup.team2.accountId}
							setTournamentInformation={setTournamentInformation}
						/>
					)}
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
					{!tournamentInformation.participantsAdvancedToNextRound[
						matchup.team1.accountId
					] &&
						round == tournamentInformation.currentRound &&
						round != 4 &&
						!tournamentInformation.participantsAdvancedToNextRound[
							matchup.team2.accountId
						] && (
							<AdvanceButton
								accountId={matchup.team1.accountId}
								setTournamentInformation={setTournamentInformation}
							/>
						)}
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
