import {
	getAllRecommendations,
	LocationFavorabilityWeight,
	SkillLevelFavorabilityWeight,
	PlaystyleFavorabilityWeight,
} from "./algorithm.js"
import { incrementWithMaximumValue } from "./recommendationUtils.js"

const RecommendationStatus = {
	INTERESTED: "Interested",
	NOT_INTERESTED: "Not Interested",
}
const TeamRejectionWeight = {
	BASE_VALUE: 0.1,
}

const TeamAcceptanceWeight = {
	BASE_VALUE: 0.1,
}

const StatusModifier = {
	ACCEPTED: 1,
	DECLINED: -1,
}

const ProfileVisitEnum = {
	BASE_VALUE: 0.005,
	MIN_VISITS_THRESHOLD: 3,
	MAX_VISITS_THRESHOLD: 20,
	ROOT_FACTOR: 0.0025,
}

function getProfileVisitsWeight(recommendationStatistics, teamAccountId) {
	if (recommendationStatistics.interactions[teamAccountId] == null)
		return NO_PROFILE_VISITS_DATA
	const playerInteractions = recommendationStatistics.interactions[teamAccountId]

	const profileVisits = Math.min(
		playerInteractions.profileVisits,
		ProfileVisitEnum.MAX_VISITS_THRESHOLD
	)

	if (profileVisits < ProfileVisitEnum.MIN_VISITS_THRESHOLD)
		return NO_PROFILE_VISITS_DATA

	const decayRate = Math.sqrt(profileVisits - ProfileVisitEnum.MIN_VISITS_THRESHOLD)
	const weightIncrement =
		ProfileVisitEnum.BASE_VALUE + decayRate * ProfileVisitEnum.ROOT_FACTOR
	return weightIncrement
}

export async function incrementProfileVisit(playerData, teamData) {
	const interactions = playerData.recommendationStatistics.interactions

	if (!interactions[teamData.accountId]) {
		interactions[teamData.accountId] = getDefaultInteractions()
	}

	interactions[teamData.accountId].profileVisits += 1
	playerData.recommendationStatistics.interactions = interactions

	const profileVisitIncrementScore = getProfileVisitsWeight(
		playerData.recommendationStatistics,
		teamData.accountId
	)

	const favorabilityWeights = playerData.recommendationStatistics.favorabilityWeights
	favorabilityWeights.locations[teamData.location] += Math.min(
		profileVisitIncrementScore,
		LocationFavorabilityWeight.MAX_WEIGHT
	)
	favorabilityWeights.skillLevels[teamData.desiredSkillLevel] += Math.min(
		profileVisitIncrementScore,
		SkillLevelFavorabilityWeight.MAX_WEIGHT
	)
	favorabilityWeights.playstyles[teamData.desiredPlaystyle] += Math.min(
		profileVisitIncrementScore,
		PlaystyleFavorabilityWeight.MAX_WEIGHT
	)

	incrementWithMaximumValue(
		favorabilityWeights.locations[teamData.location],
		profileVisitIncrementScore,
		LocationFavorabilityWeight.MAX_WEIGHT
	)

	incrementWithMaximumValue(
		favorabilityWeights.skillLevels[teamData.desiredSkillLevel],
		profileVisitIncrementScore,
		SkillLevelFavorabilityWeight.MAX_WEIGHT
	)

	incrementWithMaximumValue(
		favorabilityWeights.playstyles[teamData.desiredPlaystyle],
		profileVisitIncrementScore,
		PlaystyleFavorabilityWeight.MAX_WEIGHT
	)
	return playerData
}

export function getDefaultInteractions() {
	return {
		profileVisits: 0,
		declinedRecommendation: false,
		memberOfTeam: false,
		rejectedFromTeam: false,
	}
}

export async function getRecommendationData(playerData, allTeams) {
	const recommendations = await getAllRecommendations(playerData, allTeams)
	return recommendations
}

export function userInteractedWithRecommendation(
	playerData,
	teamData,
	recommendationStatus
) {
	if (recommendationStatus == RecommendationStatus.INTERESTED) {
		return acceptedRecommendation(playerData, teamData)
	} else {
		return declinedRecommendation(playerData, teamData)
	}
}

function adjustFavorabilityWeights(playerData, teamData, WeightEnum, statusModifier) {
	const teamLocation = teamData.location
	const teamSkillLevel = teamData.desiredSkillLevel
	const favorabilityWeights = playerData.recommendationStatistics.favorabilityWeights

	for (const playstyle of teamData.desiredPlaystyle) {
		const currentPlaystyleWeight = favorabilityWeights.playstyles[playstyle]
		let incrementPlayStyleWeight =
			PlaystyleFavorabilityWeight.MAX_WEIGHT - currentPlaystyleWeight

		incrementPlayStyleWeight *= WeightEnum.BASE_VALUE

		favorabilityWeights.playstyles[playstyle] +=
			Math.min(incrementPlayStyleWeight, PlaystyleFavorabilityWeight.MAX_WEIGHT) *
			statusModifier
	}

	const currentLocationWeight = favorabilityWeights.locations[teamLocation]
	let incrementLocationWeight =
		LocationFavorabilityWeight.MAX_WEIGHT - currentLocationWeight
	incrementLocationWeight *= WeightEnum.BASE_VALUE

	favorabilityWeights.locations[teamLocation] +=
		Math.min(incrementLocationWeight, LocationFavorabilityWeight.MAX_WEIGHT) *
		statusModifier

	const currentSkillLevelWeight = favorabilityWeights.skillLevels[teamSkillLevel]
	let incrementSkillLevelWeight =
		SkillLevelFavorabilityWeight.MAX_WEIGHT - currentSkillLevelWeight
	incrementSkillLevelWeight *= WeightEnum.BASE_VALUE

	favorabilityWeights.skillLevels[teamSkillLevel] +=
		Math.min(incrementSkillLevelWeight, SkillLevelFavorabilityWeight.MAX_WEIGHT) *
		statusModifier

	return playerData
}

function declinedRecommendation(playerData, teamData) {
	const updatedPlayerData = adjustFavorabilityWeights(
		playerData,
		teamData,
		TeamRejectionWeight,
		StatusModifier.DECLINED
	)

	playerData.recommendationStatistics.interactions[
		teamData.accountId
	].declinedRecommendation = true

	teamData.recommendationHistory.interactions[
		playerData.accountId
	].declinedRecommendation = true
	return updatedPlayerData
}

function acceptedRecommendation(playerData, teamData) {
	const updatedPlayerData = adjustFavorabilityWeights(
		playerData,
		teamData,
		TeamAcceptanceWeight,
		StatusModifier.ACCEPTED
	)
	return updatedPlayerData
}
