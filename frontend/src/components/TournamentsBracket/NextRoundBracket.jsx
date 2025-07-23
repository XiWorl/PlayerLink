import { useState } from "react"
import Navbar from "../Navbar/Navbar"

export function createNextRoundArray(tournamentInformation) {
	const finalMatchups = []
	const participants = tournamentInformation.participantsAdvancedToNextRound
	const participantValues = Object.values(participants)

	for (let i = 0; i < participantValues.length; i += 2) {
		const matchupObject = {
			team1: participantValues[i],
			team2: null,
		}

		if (i + 1 < participantValues.length) {
			matchupObject.team2 = participantValues[i + 1]
		}

		finalMatchups.push(matchupObject)
	}

	return finalMatchups
}
