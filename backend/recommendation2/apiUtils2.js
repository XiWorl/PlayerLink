import { getPlayerData } from "../api/endpointUtils.js"
import { getAllRecommendations } from "./algorithm2.js"

export async function incrementProfileVisit(playerAccountId, teamAccountId) {
    const accountData = await getPlayerData(playerAccountId, teamAccountId)
    const interactions = accountData.recommendationStatistics.interactions

    if (!interactions[teamAccountId]) {
        interactions[teamAccountId] = getDefaultInteractions()
    }

    interactions[teamAccountId].profileVisits += 1
    accountData.recommendationStatistics.interactions = interactions

    return accountData
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
    return(recommendations)
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
