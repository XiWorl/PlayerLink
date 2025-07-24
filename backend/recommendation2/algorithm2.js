import {
	updateSkillLevelWeights,
	updateLocationWeights,
	updatePlaystyleWeights,
	getRejectedTeamAttributesFrequency,
	getTeamRosterAttributesFrequency,
} from "./recommendationUtils2.js"
import {
	translateExperience,
	PlaystyleOptions,
	SkillLevelOptions,
	YearsOfExperienceOptions,
	LOCATION_OPTIONS,
} from "../ServerUtils.js"
import { getPlayerData, getTeamData, updateAccount } from "../api/endpointUtils.js"

const CollaborativeFilteringWeight = {
	LOCATION_WEIGHT: 0.4,
	SKILL_LEVEL_WEIGHT: 0.3,
	PLAYSTYLE_WEIGHT: 0.3,
}

const TeamRejectionWeight = {
	BASE_VALUE: 0.1,
}

const FinalRecommendationScoreWeight = {
	TEAM_ATTRIBUTES_WEIGHT: 0.5,
	TEAM_REJECTIONS_WEIGHT: 0.3,
	COLLABORATIVE_FILTERING_WEIGHT: 0.2,
}

const TeamAttributeWeight = {
	LOCATION_WEIGHT: 0.4,
	SKILL_LEVEL_WEIGHT: 0.3,
	PLAYSTYLE_WEIGHT: 0.3,
}

const LocationFavorabilityWeight = {
	BASE_VALUE: 0.05,
	MIN_WEIGHT: 0,
	MAX_WEIGHT: 1,
}

const SkillLevelFavorabilityWeight = {
	BASE_VALUE: 0.05,
	MIN_WEIGHT: 0,
	MAX_WEIGHT: 1,
}

const PlaystyleFavorabilityWeight = {
	BASE_VALUE: 0.05,
	MIN_WEIGHT: 0,
	MAX_WEIGHT: 1,
}

const ProfileVisitEnum = {
	BASE_VALUE: 0.005,
	MIN_VISITS_THRESHOLD: 3,
	MAX_VISITS_THRESHOLD: 20,
	ROOT_FACTOR: 0.0025,
}

const INITIAL_WEIGHT_VALUE = 0.5
const MAX_RECOMMENDATION_SCORE = 1

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

function getIncrementProfileVisitIncrementValue(playerInteractions) {
	if (playerInteractions == null) return 0

	const profileVisits = Math.min(
		playerInteractions.profileVisits,
		ProfileVisitEnum.MAX_VISITS_THRESHOLD
	)
	if (profileVisits < ProfileVisitEnum.MIN_VISITS_THRESHOLD) return
	const decayRate = Math.sqrt(profileVisits - ProfileVisitEnum.MIN_VISITS_THRESHOLD)
	const weightIncrement =
		ProfileVisitEnum.BASE_VALUE + decayRate * ProfileVisitEnum.ROOT_FACTOR
	return weightIncrement
}

function declinedRecommendation(playerData, teamData) {
	const teamLocation = teamData.location
	for (const playstyle of teamData.desiredPlaystyle) {
		console.log(playstyle)
	}

	const currentWeight =
		playerData.recommendationStatistics.favorabilityWeights.locations[teamLocation]
	const incrementMultiplier = Math.min(
		LocationFavorabilityWeight.MAX_WEIGHT - currentWeight
	)
	playerData.recommendationStatistics.favorabilityWeights.locations[teamLocation] -=
		incrementMultiplier * TeamRejectionWeight.BASE_VALUE
	playerData.recommendationStatistics.interactions[
		teamData.accountId
	].declinedRecommendations = true
}

function getTeamRecommendationScore(playerData, teamData) {
	const favorabilityWeights = playerData.recommendationStatistics.favorabilityWeights
	const locationScore =
		favorabilityWeights.locations[teamData.location] *
		TeamAttributeWeight.LOCATION_WEIGHT
	const skillLevelScore = Math.min(
		favorabilityWeights.skillLevels[teamData.desiredSkillLevel] *
			TeamAttributeWeight.SKILL_LEVEL_WEIGHT,
		MAX_RECOMMENDATION_SCORE
	)

	let playstyleScore = 0
	for (const playstyle of teamData.desiredPlaystyle) {
		playstyleScore += Math.min(
			favorabilityWeights.playstyles[playstyle],
			MAX_RECOMMENDATION_SCORE
		)
	}
	playstyleScore =
		(playstyleScore / teamData.desiredPlaystyle.length) *
		TeamAttributeWeight.PLAYSTYLE_WEIGHT
	return locationScore + skillLevelScore + playstyleScore
}

async function getAverageRejectedPlayerAttributesScore(teamData, playerData) {
	const teamAttributesFrequency = await getRejectedTeamAttributesFrequency(teamData)
	const playerSkillLevel = translateExperience(playerData.yearsOfExperience)
	let finalTeamScore = 0

	if (teamAttributesFrequency[playerSkillLevel]) {
		const score = teamAttributesFrequency[playerSkillLevel]
		finalTeamScore += score * CollaborativeFilteringWeight.SKILL_LEVEL_WEIGHT
	}
	if (teamAttributesFrequency[playerData.location]) {
		const score = teamAttributesFrequency[playerData.location]
		finalTeamScore += score * CollaborativeFilteringWeight.LOCATION_WEIGHT
	}
	if (teamAttributesFrequency[playerData.playstyle]) {
		const score = teamAttributesFrequency[playerData.playstyle]
		finalTeamScore += score * CollaborativeFilteringWeight.PLAYSTYLE_WEIGHT
	}
	return finalTeamScore
}

export async function getAllRecommendations(playerData, allTeams) {
	const recommendations = []
	for (const teamData of allTeams) {
		const rejectionSimilarity = await getAverageRejectedPlayerAttributesScore(
			teamData,
			playerData
		) * FinalRecommendationScoreWeight.COLLABORATIVE_FILTERING_WEIGHT
		const teamRecommendationScore = getTeamRecommendationScore(playerData, teamData) * FinalRecommendationScoreWeight.TEAM_ATTRIBUTES_WEIGHT
		const rosterSimilarityScore = getTeamRosterAttributesFrequency(teamData) //* FinalRecommendationScoreWeight.TEAM_REJECTIONS_WEIGHT
		const finalScore = teamRecommendationScore + rejectionSimilarity

		recommendations.push({team: teamData, score: finalScore})
	}
	return recommendations
}

async function tester() {
	const playerData = await getPlayerData(61)
	const teamData = await getTeamData(43)
	// const increment = getIncrementProfileVisitIncrementValue(
	// 	playerData.recommendationStatistics.interactions[teamData.accountId]
	// )
	updateAllWeights(increment, increment, increment, playerData, teamData)
	getAverageRejectedPlayerAttributesScore(teamData, playerData)
	// const finalRecommendationScore = FinalRecommendationScoreWeight.TEAM_ATTRIBUTES_WEIGHT *getTeamRecommendationScore(playerData, teamData)
}
