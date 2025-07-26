import {
	getRejectedTeamAttributesFrequency,
	getTeamRosterAttributesFrequency,
} from "./recommendationUtils.js"
import { translateExperience } from "../ServerUtils.js"

const CollaborativeFilteringWeight = {
	LOCATION_WEIGHT: 0.4,
	SKILL_LEVEL_WEIGHT: 0.3,
	PLAYSTYLE_WEIGHT: 0.3,
}

const RosterSimilarityWeight = {
	LOCATION_WEIGHT: 0.4,
	SKILL_LEVEL_WEIGHT: 0.3,
	PLAYSTYLE_WEIGHT: 0.3,
}

const FinalRecommendationScoreWeight = {
	TEAM_ATTRIBUTES_WEIGHT: 0.5,
	ROSTER_SIMILARITY_WEIGHT: 0.3,
	COLLABORATIVE_FILTERING_WEIGHT: 0.2,
}

const TeamAttributeWeight = {
	MAX_RECOMMENDATION_SCORE: 1,
	LOCATION_WEIGHT: 0.4,
	SKILL_LEVEL_WEIGHT: 0.3,
	PLAYSTYLE_WEIGHT: 0.3,
}

export const LocationFavorabilityWeight = {
	BASE_VALUE: 0.05,
	MIN_WEIGHT: 0,
	MAX_WEIGHT: 1,
}

export const SkillLevelFavorabilityWeight = {
	BASE_VALUE: 0.05,
	MIN_WEIGHT: 0,
	MAX_WEIGHT: 1,
}

export const PlaystyleFavorabilityWeight = {
	BASE_VALUE: 0.05,
	MIN_WEIGHT: 0,
	MAX_WEIGHT: 1,
}

const MAX_RECOMMENDATION_SCORE = 1

function getTeamFavorabilityScore(playerData, teamData) {
	const favorabilityWeights = playerData.recommendationStatistics.favorabilityWeights
	const locationFavorability = favorabilityWeights.locations[teamData.location]
	const skillLevelFavorability =
		favorabilityWeights.skillLevels[teamData.desiredSkillLevel]

	const locationScore = locationFavorability * TeamAttributeWeight.LOCATION_WEIGHT
	const skillLevelScore =
		skillLevelFavorability * TeamAttributeWeight.SKILL_LEVEL_WEIGHT

	let playstyleScore = 0
	for (const playstyle of teamData.desiredPlaystyle) {
		playstyleScore += favorabilityWeights.playstyles[playstyle]
	}
	playstyleScore = playstyleScore / teamData.desiredPlaystyle.length
	playstyleScore *= TeamAttributeWeight.PLAYSTYLE_WEIGHT

	const finalFavorabilityScore = locationScore + skillLevelScore + playstyleScore

	return Math.min(finalFavorabilityScore, TeamAttributeWeight.MAX_RECOMMENDATION_SCORE)
}

async function getSimilarityScore(teamAttributesFrequency, playerData, weight) {
	const playerSkillLevel = translateExperience(playerData.yearsOfExperience)
	let finalScore = 0

	if (teamAttributesFrequency[playerSkillLevel]) {
		const score = teamAttributesFrequency[playerSkillLevel]
		finalScore += score * weight.SKILL_LEVEL_WEIGHT
	}
	if (teamAttributesFrequency[playerData.location]) {
		const score = teamAttributesFrequency[playerData.location]
		finalScore += score * weight.LOCATION_WEIGHT
	}
	if (teamAttributesFrequency[playerData.playstyle]) {
		const score = teamAttributesFrequency[playerData.playstyle]
		finalScore += score * weight.PLAYSTYLE_WEIGHT
	}
	return finalScore
}

async function getRosterSimilarityScore(teamData, playerData) {
	const teamRosterAttributesFrequency = await getTeamRosterAttributesFrequency(teamData)
	const similarityScore = getSimilarityScore(
		teamRosterAttributesFrequency,
		playerData,
		RosterSimilarityWeight
	)
	return similarityScore
}

async function getAverageDeclinedPlayerScore(teamData, playerData) {
	const teamAttributesFrequency = await getRejectedTeamAttributesFrequency(teamData)
	const similarityScore = getSimilarityScore(
		teamAttributesFrequency,
		playerData,
		CollaborativeFilteringWeight
	)
	return similarityScore
}

export async function getAllRecommendations(playerData, allTeams) {
	const recommendations = []

	for (const teamData of allTeams) {
		let rosterSimilarityScore = await getRosterSimilarityScore(teamData, playerData)
		rosterSimilarityScore *= FinalRecommendationScoreWeight.ROSTER_SIMILARITY_WEIGHT

		let similarityToAverageDeclinedPlayer = await getAverageDeclinedPlayerScore(
			teamData,
			playerData
		)
		similarityToAverageDeclinedPlayer *=
			FinalRecommendationScoreWeight.COLLABORATIVE_FILTERING_WEIGHT

		let teamFavorabilityScore = getTeamFavorabilityScore(playerData, teamData)
		teamFavorabilityScore *= FinalRecommendationScoreWeight.TEAM_ATTRIBUTES_WEIGHT

		let finalScore =
			teamFavorabilityScore +
			similarityToAverageDeclinedPlayer +
			rosterSimilarityScore
		finalScore = Math.min(finalScore, MAX_RECOMMENDATION_SCORE)

		recommendations.push({ team: teamData, score: finalScore })
	}

	return recommendations
}
