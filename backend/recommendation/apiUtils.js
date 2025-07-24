import {
	getTeamRecommendationsForPlayer,
	getTopRecommendedTeams,
	recordProfileVisit,
	recordDeclinedRecommendation,
} from "./recommendationUtils.js"

/**
 * Increment a player's profile visit to a team
 * @param {string} playerAccountId - The player's account ID
 * @param {string} teamAccountId - The team's account ID
 * @returns {Promise<Object>} - A promise that resolves to the updated player data
 */
export async function incrementProfileVisit(playerAccountId, teamAccountId) {
	try {
		// Record the profile visit in the recommendation system
		const updatedPlayer = await recordProfileVisit(playerAccountId, teamAccountId)
		return updatedPlayer
	} catch (error) {
		console.error("Error incrementing profile visit:", error)
		throw error
	}
}

/**
 * Get team recommendations for a player
 * @param {string} playerAccountId - The player's account ID
 * @param {number} limit - The maximum number of recommendations to return
 * @returns {Promise<Array>} - A promise that resolves to an array of recommended teams
 */
export async function getRecommendations(playerAccountId, limit = 5) {
	try {
		// Get the top recommended teams for the player
		const recommendations = await getTopRecommendedTeams(playerAccountId, limit)
		return recommendations
	} catch (error) {
		console.error("Error getting recommendations:", error)
		throw error
	}
}

/**
 * Record a player's declined recommendation for a team
 * @param {string} playerAccountId - The player's account ID
 * @param {string} teamAccountId - The team's account ID
 * @returns {Promise<Object>} - A promise that resolves to the updated player data
 */
export async function declineRecommendation(playerAccountId, teamAccountId) {
	try {
		// Record the declined recommendation in the recommendation system
		const updatedPlayer = await recordDeclinedRecommendation(
			playerAccountId,
			teamAccountId
		)
		return updatedPlayer
	} catch (error) {
		console.error("Error declining recommendation:", error)
		throw error
	}
}

/**
 * Get detailed information about a team recommendation
 * @param {string} playerAccountId - The player's account ID
 * @param {string} teamAccountId - The team's account ID
 * @returns {Promise<Object>} - A promise that resolves to the recommendation details
 */
export async function getRecommendationDetails(playerAccountId, teamAccountId) {
	try {
		// Get all recommendations for the player
		const allRecommendations = await getTeamRecommendationsForPlayer(playerAccountId)

		// Find the specific recommendation for the team
		const recommendation = allRecommendations.find(
			(rec) => rec.team.accountId === parseInt(teamAccountId)
		)

		if (!recommendation) {
			throw new Error(
				`No recommendation found for team with account ID ${teamAccountId}`
			)
		}

		return recommendation
	} catch (error) {
		console.error("Error getting recommendation details:", error)
		throw error
	}
}
