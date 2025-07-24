/**
 * Utility Functions for Team Recommendation Algorithm
 *
 * This file contains utility functions for the team recommendation algorithm.
 * It provides helper functions for working with recommendation data structures.
 */

import { recommendTeams, createDefaultRecommendationStatistics } from "./algorithm.js"
import { LOCATION_OPTIONS, SkillLevelOptions, PlaystyleOptions } from "../ServerUtils.js"

/**
 * Get team recommendations for a player
 * This function generates recommendations for a player based on their preferences
 *
 * @param {Object} player - The player object
 * @param {Array} teams - Array of team objects
 * @returns {Array} - Array of recommended teams with scores
 */
function getTeamRecommendationsForPlayer(player, teams) {
	// In a real implementation, you would:
	// 1. Retrieve the player data from the database
	// const player = await getPlayerFromDatabase(playerAccountId);

	// 2. Retrieve all eligible teams from the database
	// const teams = await getEligibleTeamsFromDatabase();

	// 3. Generate recommendations using the algorithm
	const recommendations = recommendTeams(player, teams)

	return recommendations
}

/**
 * Initialize recommendation statistics for a new player
 * This function creates default recommendation statistics for a new player
 *
 * @param {Object} locationOptions - Object containing location options
 * @param {Object} skillLevelOptions - Object containing skill level options
 * @param {Object} playstyleOptions - Object containing playstyle options
 * @returns {Object} - Default recommendation statistics
 */
function initializePlayerRecommendationStatistics() {
	// Create default recommendation statistics using the algorithm's helper function
	return createDefaultRecommendationStatistics(
		LOCATION_OPTIONS,
		SkillLevelOptions,
		PlaystyleOptions
	)
}

/**
 * Initialize recommendation history for a new team
 * This function creates default recommendation history for a new team
 *
 * @returns {Object} - Default recommendation history
 */
function initializeTeamRecommendationHistory() {
	// Create default recommendation history
	return {
		interactions: {},
	}
}

/**
 * Record a player's profile visit to a team
 * This function updates the player's recommendation statistics based on a profile visit
 *
 * @param {Object} player - The player object
 * @param {Object} team - The team object
 * @param {number} profileVisits - The number of profile visits
 * @returns {Object} - Updated player object
 */
function recordProfileVisit(player, team, profileVisits) {
	// In a real implementation, you would:
	// 1. Retrieve the player and team data from the database
	// const player = await getPlayerFromDatabase(playerAccountId);
	// const team = await getTeamFromDatabase(teamAccountId);

	// 2. Create a copy of the player object to avoid mutating the original
	const updatedPlayer = JSON.parse(JSON.stringify(player))

	// 3. Initialize or update the team interactions
	if (!updatedPlayer.recommendationStatistics.interactions[team.accountId]) {
		updatedPlayer.recommendationStatistics.interactions[team.accountId] = {
			profileVisits: profileVisits,
			declinedRecommendation: false,
			rejectedFromTeam: false,
		}
	} else {
		updatedPlayer.recommendationStatistics.interactions[
			team.accountId
		].profileVisits = profileVisits
	}

	// 4. In a real implementation, you would save the updated player to the database
	// await savePlayerToDatabase(updatedPlayer);

	return updatedPlayer
}

/**
 * Record a player's declined recommendation for a team
 * This function updates the player's recommendation statistics when they decline a recommendation
 *
 * @param {Object} player - The player object
 * @param {Object} team - The team object
 * @returns {Object} - Updated player object
 */
function recordDeclinedRecommendation(player, team) {
	// In a real implementation, you would:
	// 1. Retrieve the player and team data from the database
	// const player = await getPlayerFromDatabase(playerAccountId);
	// const team = await getTeamFromDatabase(teamAccountId);

	// 2. Create a copy of the player object to avoid mutating the original
	const updatedPlayer = JSON.parse(JSON.stringify(player))

	// 3. Initialize or update the team interactions
	if (!updatedPlayer.recommendationStatistics.interactions[team.accountId]) {
		updatedPlayer.recommendationStatistics.interactions[team.accountId] = {
			profileVisits: 0,
			declinedRecommendation: true,
			rejectedFromTeam: false,
		}
	} else {
		updatedPlayer.recommendationStatistics.interactions[
			team.accountId
		].declinedRecommendation = true
	}

	// 4. Create a copy of the team object to avoid mutating the original
	const updatedTeam = JSON.parse(JSON.stringify(team))

	// 5. Update the team's recommendation history
	if (!updatedTeam.recommendationHistory.interactions[player.accountId]) {
		updatedTeam.recommendationHistory.interactions[player.accountId] = {
			declinedRecommendation: true,
		}
	} else {
		updatedTeam.recommendationHistory.interactions[
			player.accountId
		].declinedRecommendation = true
	}

	// 6. In a real implementation, you would save the updated player and team to the database
	// await savePlayerToDatabase(updatedPlayer);
	// await saveTeamToDatabase(updatedTeam);

	return updatedPlayer
}

/**
 * Get the top N recommended teams for a player
 * This function returns the top N recommended teams for a player
 *
 * @param {Object} player - The player object
 * @param {Array} teams - Array of team objects
 * @param {number} limit - The maximum number of recommendations to return
 * @returns {Array} - Array of the top N recommended teams
 */
function getTopRecommendedTeams(player, teams, limit = 5) {
	// Get all recommendations for the player
	const recommendations = getTeamRecommendationsForPlayer(player, teams)

	// Return the top N recommendations
	return recommendations.slice(0, limit)
}

export {
	getTeamRecommendationsForPlayer,
	initializePlayerRecommendationStatistics,
	initializeTeamRecommendationHistory,
	recordProfileVisit,
	recordDeclinedRecommendation,
	getTopRecommendedTeams,
}
