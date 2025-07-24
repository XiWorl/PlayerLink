import {
	updateSkillLevelWeights,
	updateLocationWeights,
	updatePlaystyleWeights,
} from "./recommendationUtils2.js"
import { getPlayerData, getTeamData, updateAccount } from "../api/endpointUtils.js"

const CollaborativeFilteringWeight = {
	BASE_VALUE: 1,
}

const TeamRejectionWeight = {
	BASE_VALUE: 0.1,
}

const FinalRecommendationScoreWeight = {
	TEAM_ATTRIBUUTES_WEIGHT: 0.5,
	TEAM_REJECTIONS_WEIGHT: 0.5,
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

export function updateAllWeights(skillLevelIncrement, locationIncrement, playstyleIncrement, playerData, teamData) {
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
	const profileVisits = Math.min(
		playerInteractions.profileVisits,
		ProfileVisitEnum.MAX_VISITS_THRESHOLD
	)
	if (profileVisits < ProfileVisitEnum.MIN_VISITS_THRESHOLD) return
	const decayRate = Math.sqrt(profileVisits - ProfileVisitEnum.MIN_VISITS_THRESHOLD)
	const weightIncrement = ProfileVisitEnum.BASE_VALUE + (decayRate * ProfileVisitEnum.ROOT_FACTOR)
	return weightIncrement
}

function declinedRecommendation(playerData, teamData) {
    const teamLocation = teamData.location
    const teamDesiredSkillLevel = teamData.desiredSkillLevel
    for (const playstyle of teamData.desiredPlaystyle) {
        console.log(playstyle)
	}

    const currentWeight = playerData.recommendationStatistics.favorabilityWeights.locations[teamLocation]
    const incrementMultiplier = Math.min(LocationFavorabilityWeight.MAX_WEIGHT - currentWeight)
    console.log(incrementMultiplier * TeamRejectionWeight.BASE_VALUE)
    playerData.recommendationStatistics.favorabilityWeights.locations[teamLocation] -= incrementMultiplier * TeamRejectionWeight.BASE_VALUE
    playerData.recommendationStatistics.interactions[teamData.accountId].declinedRecommendations = true
    // console.log(playerData.location == teamLocation)
    // if (teamLocation == playerData.location) {

    // }
}

async function tester() {
	const playerData = await getPlayerData(61)
	const teamData = await getTeamData(41)
	const increment = getIncrementProfileVisitIncrementValue(
		playerData.recommendationStatistics.interactions[teamData.accountId]
	)
	updateAllWeights(increment, increment, increment,playerData, teamData)
    declinedRecommendation(playerData, teamData)
	console.log(playerData.recommendationStatistics)
}

tester()
