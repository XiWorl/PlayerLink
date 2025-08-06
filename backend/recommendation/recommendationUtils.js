import { translateExperience, AccountType } from "../ServerUtils.js"
import { getAccountData } from "../api/endpointsUtils.js"

export function incrementWithMaximumValue(value, increment, maximum) {
	value = Math.min(value + increment, maximum)
}

function addAttributesToFrequency(frequencyObject, key) {
	if (frequencyObject[key] == null) {
		frequencyObject[key] = 1
	} else {
		frequencyObject[key] += 1
	}
	return frequencyObject[key]
}

async function getAttributesFrequency(frequencyData, checkTeamRoster, totalAttributes) {
	let accountId = 0
	const freqeuncyObject = {}

	for (const [key, value] of Object.entries(frequencyData)) {
		if (checkTeamRoster && value.declinedRecommendation == true) {
			continue
		} else if (checkTeamRoster) {
			accountId = parseInt(value)
		} else {
			accountId = parseInt(key)
		}
		const playerData = await getAccountData(accountId, AccountType.PLAYER)
		const playerLocation = playerData.location
		const playerPlaystyle = playerData.playstyle
		const playerYearsOfExperience = translateExperience(playerData.yearsOfExperience)

		freqeuncyObject[playerLocation] =
			addAttributesToFrequency(freqeuncyObject, playerLocation) / totalAttributes
		freqeuncyObject[playerPlaystyle] =
			addAttributesToFrequency(freqeuncyObject, playerPlaystyle) / totalAttributes
		freqeuncyObject[playerYearsOfExperience] =
			addAttributesToFrequency(freqeuncyObject, playerYearsOfExperience) /
			totalAttributes
	}
	return freqeuncyObject
}

export async function getRejectedTeamAttributesFrequency(teamData) {
	const interactions = teamData.recommendationHistory.interactions
	const totalAttributes = Object.keys(interactions).length
	return getAttributesFrequency(interactions, false, totalAttributes)
}

export async function getTeamRosterAttributesFrequency(teamData) {
	return getAttributesFrequency(
		teamData.rosterAccountIds,
		true,
		teamData.rosterAccountIds.length
	)
}

export function getEligibleTeams(playerData, allTeams) {
	const eligibleTeams = []

	for (const team of allTeams) {
		const playerInteractions = playerData.recommendationStatistics.interactions

		if (team.currentlyHiring == false) continue
		if (team.rosterAccountIds.includes(playerData.accountId)) continue
		if (playerData.willingToRelocate == false && team.location != playerData.location)
			continue
		if (playerInteractions[team.accountId] != null) {
			if (playerInteractions[team.accountId].declinedRecommendation == true)
				continue
			if (playerInteractions[team.accountId].acceptedRecommendation == true)
				continue
			if (playerInteractions[team.accountId].rejectedFromTeam == true) continue
		}

		eligibleTeams.push(team)
	}

	return eligibleTeams
}
