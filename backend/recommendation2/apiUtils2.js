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
