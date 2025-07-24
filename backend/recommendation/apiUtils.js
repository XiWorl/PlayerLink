import { getPlayerData } from "../api/endpointUtils.js"

export async function incrementProfileVisit(playerAccountId, teamAccountId) {
    const accountData = await getPlayerData(playerAccountId, teamAccountId)
    const teamInteractions = accountData.recommendationStatistics.interactions[teamAccountId]

    if (teamInteractions == null) {
        accountData.recommendationStatistics.interactions[teamAccountId] = {
            profileVisits: 1,
            declinedRecommendation: false,
            memberOfTeam: false,
            rejectedFromTeam: false,
        }
    } else {
        teamInteractions.profileVisits += 1
    }

    return accountData
}
