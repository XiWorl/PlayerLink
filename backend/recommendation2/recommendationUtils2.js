import {
	GameOptions,
	PlaystyleOptions,
	SkillLevelOptions,
	YearsOfExperienceOptions,
	LOCATION_OPTIONS,
	translateExperience,
} from "../ServerUtils.js"
import { getPlayerData } from "../api/endpointUtils.js"

export const AllSignals = {}

export function updateLocationWeights(
	increment,
	recommendationStatistics,
	MAX_VALUE,
	team
) {
	const locationWeights = recommendationStatistics.favorabilityWeights.locations
	const locationWeight = locationWeights[team.location]
	locationWeights[team.location] = Math.min(locationWeight + increment, MAX_VALUE)
	return recommendationStatistics
}

export function updatePlaystyleWeights(
	increment,
	recommendationStatistics,
	MAX_VALUE,
	team
) {
	for (const playstyle of team.desiredPlaystyle) {
		const playstyleWeights = recommendationStatistics.favorabilityWeights.playstyles
		const playstyleWeight = playstyleWeights[playstyle]
		playstyleWeights[playstyle] = Math.min(playstyleWeight + increment, MAX_VALUE)
	}
}

export function updateSkillLevelWeights(
	increment,
	recommendationStatistics,
	MAX_VALUE,
	team
) {
	const skillLevelWeights = recommendationStatistics.favorabilityWeights.skillLevels
	const skillLevelWeight = skillLevelWeights[team.desiredSkillLevel]
	skillLevelWeights[team.desiredPlaystyle] = Math.min(
		skillLevelWeight + increment,
		MAX_VALUE
	)
	return recommendationStatistics
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
		const playerData = await getPlayerData(accountId)
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
	return getAttributesFrequency(teamData.rosterAccountIds, true, teamData.rosterAccountIds.length)
}

export function updateAllWeights(
	skillLevelIncrement,
	locationIncrement,
	playstyleIncrement,
	playerData,
	teamData
) {
	updateSkillLevelWeights(
		skillLevelIncrement,
		playerData.recommendationStatistics,
		SkillLevelFavorabilityWeight.MAX_WEIGHT,
		teamData
	)
	updateLocationWeights(
		locationIncrement,
		playerData.recommendationStatistics,
		LocationFavorabilityWeight.MAX_WEIGHT,
		teamData
	)
	updatePlaystyleWeights(
		playstyleIncrement,
		playerData.recommendationStatistics,
		PlaystyleFavorabilityWeight.MAX_WEIGHT,
		teamData
	)
}
