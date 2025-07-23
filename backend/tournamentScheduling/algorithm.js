const { AccountType, translateExperience } = require("../ServerUtils.js")
const { getAccountData } = require("../api/endpointsUtils.js")
const {
	SkillLevelScores,
	NearbyLocations,
	TournamentSchedulingWeights,
} = require("../ServerUtils.js")
const { translateExperience } = require("./utils.js")

const SKILL_LEVEL_RANGE = 10



async function calculateTeamSkillLevel(team) {
	let totalTeamSkillLevel = 0
	for (const playerId of team.rosterAccountIds) {
		const playerData = await getAccountData(playerId, AccountType.PLAYER)
		const playerSkillLevelText = translateExperience(playerData.yearsOfExperience)
		const playerSkillLevelScore = SkillLevelScores[playerSkillLevelText]
		totalTeamSkillLevel += playerSkillLevelScore
	}
	return totalTeamSkillLevel
}

/**
 * Placeholder function for calculating conflict score between two teams
 * @param {Object} team1 - First team
 * @param {Object} team2 - Second team
 * @returns {number} - Conflict score between the teams
 */
async function getConflictScore(team1, team2) {
	let conflictScore = 0

	conflictScore += TournamentSchedulingWeights.LOCATION
	if (team1.location === team2.location) {
		conflictScore -= TournamentSchedulingWeights.LOCATION
	} else if (NearbyLocations[team1.location].has(team2.location)) {
		conflictScore -= TournamentSchedulingWeights.LOCATION / 2
	}

	conflictScore += TournamentSchedulingWeights.SKILL_LEVEL
	if (
		Math.abs(calculateTeamSkillLevel(team1) - calculateTeamSkillLevel(team2)) <=
		SKILL_LEVEL_RANGE
	) {
		conflictScore -= TournamentSchedulingWeights.SKILL_LEVEL
	}

	conflictScore += TournamentSchedulingWeights.GAME
	if (team1.supportedGames.some((game) => team2.supportedGames.includes(game))) {
		conflictScore -= TournamentSchedulingWeights.GAME
	}

	const setOfPlayers = new Set(team2.roster)
	const numberOfSharedPlayers = team1.rosterAccountIds.filter((int) =>
		setOfPlayers.has(int)
	).length
	conflictScore += TournamentSchedulingWeights.PLAYER * numberOfSharedPlayers

	return conflictScore
}

/**
 * Creates a conflict matrix for all possible team pairings
 * @param {Array} teams - Array of team objects
 * @returns {Array} - 2D matrix of conflict scores
 */
async function createConflictMatrix(teams) {
	const numTeams = teams.length
	const conflictMatrix = Array(numTeams)
		.fill()
		.map(() => Array(numTeams).fill(0))

	for (let i = 0; i < numTeams; i++) {
		for (let j = 0; j < numTeams; j++) {
			if (i === j) {
				conflictMatrix[i][j] = Infinity
			} else {
				conflictMatrix[i][j] = await getConflictScore(teams[i], teams[j])
			}
		}
	}

	return conflictMatrix
}

/**
 * Creates first-round matchups using a greedy algorithm based on conflict scores
 * @param {Array} teams - Array of team objects
 * @param {Array} conflictMatrix - 2D matrix of conflict scores
 * @returns {Array} - Array of matchup objects, each containing two teams
 */
function createFirstRoundMatchups(teams, conflictMatrix) {
	const numTeams = teams.length
	const allPairs = []

	for (let i = 0; i < numTeams; i++) {
		for (let j = i + 1; j < numTeams; j++) {
			allPairs.push({
				team1Index: i,
				team2Index: j,
				team1: teams[i],
				team2: teams[j],
				conflictScore: conflictMatrix[i][j],
			})
		}
	}

	allPairs.sort((a, b) => a.conflictScore - b.conflictScore)

	const matchups = []
	const usedTeams = new Set()

	for (const pair of allPairs) {
		if (usedTeams.has(pair.team1Index) || usedTeams.has(pair.team2Index)) {
			continue
		}

		matchups.push({
			team1: pair.team1,
			team2: pair.team2,
			conflictScore: pair.conflictScore,
		})

		usedTeams.add(pair.team1Index)
		usedTeams.add(pair.team2Index)

		if (matchups.length === 8) {
			break
		}
	}

	return matchups
}

/**
 * Main function to generate tournament matchups
 * @param {Array} teams - Array of team objects (must contain exactly 16 teams)
 * @returns {Array} - Array of 8 matchup objects for the first round
 */
async function generateTournamentMatchups(teams) {
	const conflictMatrix = await createConflictMatrix(Object.values(teams))
	const matchups = await createFirstRoundMatchups(Object.values(teams), conflictMatrix)

	return matchups
}

module.exports = {
	getConflictScore,
	createConflictMatrix,
	createFirstRoundMatchups,
	generateTournamentMatchups,
}
