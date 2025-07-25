export function createNextRoundArray(tournamentInformation) {
	const finalMatchups = []
	const participants = tournamentInformation.participantsAdvancedToNextRound
	const participantValues = Object.values(participants)

	const array = Object.entries(tournamentInformation.participantsAdvancedToNextRound)
	array.sort((a, b) => a[1].advancedAt - b[1].advancedAt)

	for (let i = 0; i < array.length; i += 2) {
		const matchupObject = {
			team1: array[i][1],
			team2: null,
		}

		if (i + 1 < participantValues.length) {
			matchupObject.team2 = array[i+1][1]
		}

		finalMatchups.push(matchupObject)
	}
	return finalMatchups
}
