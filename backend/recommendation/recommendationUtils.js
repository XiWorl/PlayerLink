import { PrismaClient } from "../generated/prisma"
const prisma = new PrismaClient()
import {
	DEFAULT_RECOMMENDATION_STATISTICS,
	DEFAULT_RECOMMENDATION_HISTORY,
} from "../api/utils.js"
import {
	generateTeamRecommendations,
	processProfileVisit,
	processDeclinedRecommendation,
} from "./algorithm.js"

/**
 * Get team recommendations for a player
 * @param {string} playerAccountId - The player's account ID
 * @returns {Promise<Array>} - A promise that resolves to an array of recommended teams with scores
 */
async function getTeamRecommendationsForPlayer(playerAccountId) {
	try {
		// Get the player data
		const player = await prisma.player.findUnique({
			where: { accountId: parseInt(playerAccountId) },
		})

		if (!player) {
			throw new Error(`Player with account ID ${playerAccountId} not found`)
		}

		// Get all teams
		const teams = await prisma.team.findMany({
			where: {
				currentlyHiring: true,
			},
		})

		// Generate recommendations
		const recommendations = generateTeamRecommendations(player, teams)

		return recommendations
	} catch (error) {
		console.error("Error getting team recommendations:", error)
		throw error
	}
}

/**
 * Initialize recommendation statistics for a new player
 * @param {string} playerAccountId - The player's account ID
 * @returns {Promise<Object>} - A promise that resolves to the updated player object
 */
async function initializePlayerRecommendationStatistics(playerAccountId) {
	try {
		const updatedPlayer = await prisma.player.update({
			where: { accountId: parseInt(playerAccountId) },
			data: {
				recommendationStatistics: DEFAULT_RECOMMENDATION_STATISTICS,
			},
		})

		return updatedPlayer
	} catch (error) {
		console.error("Error initializing player recommendation statistics:", error)
		throw error
	}
}

/**
 * Initialize recommendation history for a new team
 * @param {string} teamAccountId - The team's account ID
 * @returns {Promise<Object>} - A promise that resolves to the updated team object
 */
async function initializeTeamRecommendationHistory(teamAccountId) {
	try {
		const updatedTeam = await prisma.team.update({
			where: { accountId: parseInt(teamAccountId) },
			data: {
				recommendationHistory: DEFAULT_RECOMMENDATION_HISTORY,
			},
		})

		return updatedTeam
	} catch (error) {
		console.error("Error initializing team recommendation history:", error)
		throw error
	}
}

/**
 * Record a player's profile visit to a team
 * @param {string} playerAccountId - The player's account ID
 * @param {string} teamAccountId - The team's account ID
 * @returns {Promise<Object>} - A promise that resolves to the updated player object
 */
async function recordProfileVisit(playerAccountId, teamAccountId) {
	try {
		// Get the player and team data
		const player = await prisma.player.findUnique({
			where: { accountId: parseInt(playerAccountId) },
		})

		const team = await prisma.team.findUnique({
			where: { accountId: parseInt(teamAccountId) },
		})

		if (!player || !team) {
			throw new Error(`Player or team not found`)
		}

		// Process the profile visit
		const updatedPlayer = processProfileVisit(player, team)

		// Update the player in the database
		const savedPlayer = await prisma.player.update({
			where: { accountId: parseInt(playerAccountId) },
			data: {
				recommendationStatistics: updatedPlayer.recommendationStatistics,
			},
		})

		return savedPlayer
	} catch (error) {
		console.error("Error recording profile visit:", error)
		throw error
	}
}

/**
 * Record a player's declined recommendation for a team
 * @param {string} playerAccountId - The player's account ID
 * @param {string} teamAccountId - The team's account ID
 * @returns {Promise<Object>} - A promise that resolves to the updated player object
 */
async function recordDeclinedRecommendation(playerAccountId, teamAccountId) {
	try {
		// Get the player and team data
		const player = await prisma.player.findUnique({
			where: { accountId: parseInt(playerAccountId) },
		})

		const team = await prisma.team.findUnique({
			where: { accountId: parseInt(teamAccountId) },
		})

		if (!player || !team) {
			throw new Error(`Player or team not found`)
		}

		// Process the declined recommendation
		const updatedPlayer = processDeclinedRecommendation(player, team)

		// Update the player in the database
		const savedPlayer = await prisma.player.update({
			where: { accountId: parseInt(playerAccountId) },
			data: {
				recommendationStatistics: updatedPlayer.recommendationStatistics,
			},
		})

		// Update the team in the database
		await prisma.team.update({
			where: { accountId: parseInt(teamAccountId) },
			data: {
				recommendationHistory: team.recommendationHistory,
			},
		})

		return savedPlayer
	} catch (error) {
		console.error("Error recording declined recommendation:", error)
		throw error
	}
}

/**
 * Get the top N recommended teams for a player
 * @param {string} playerAccountId - The player's account ID
 * @param {number} limit - The maximum number of recommendations to return
 * @returns {Promise<Array>} - A promise that resolves to an array of the top N recommended teams
 */
async function getTopRecommendedTeams(playerAccountId, limit = 5) {
	try {
		const recommendations = await getTeamRecommendationsForPlayer(playerAccountId)
		return recommendations.slice(0, limit)
	} catch (error) {
		console.error("Error getting top recommended teams:", error)
		throw error
	}
}

export {
	getTeamRecommendationsForPlayer,
	initializePlayerRecommendationStatistics,
	initializeTeamRecommendationHistory,
	recordProfileVisit,
	recordDeclinedRecommendation,
	getTopRecommendedTeams,
}
