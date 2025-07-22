// const sampleTeams = [
// 	{
// 		name: "Alpha Squad",
// 		players: ["player1", "player2", "player3", "player4", "player5"],
// 		location: "New York",
// 		supportedGames: ["League of Legends", "Valorant"],
// 		skillLevel: 85,
// 	},
// 	{
// 		name: "Beta Bombers",
// 		players: ["player6", "player7", "player8", "player9", "player10"],
// 		location: "Los Angeles",
// 		supportedGames: ["League of Legends", "Dota 2"],
// 		skillLevel: 82,
// 	},
// 	{
// 		name: "Gamma Gladiators",
// 		players: ["player11", "player12", "player13", "player14", "player15"],
// 		location: "Chicago",
// 		supportedGames: ["Valorant", "Counter-Strike"],
// 		skillLevel: 78,
// 	},
// 	{
// 		name: "Delta Destroyers",
// 		players: ["player16", "player17", "player18", "player19", "player20"],
// 		location: "Miami",
// 		supportedGames: ["Fortnite", "Apex Legends"],
// 		skillLevel: 90,
// 	},
// 	{
// 		name: "Epsilon Elite",
// 		players: ["player21", "player22", "player23", "player24", "player25"],
// 		location: "Seattle",
// 		supportedGames: ["League of Legends", "Valorant", "Counter-Strike"],
// 		skillLevel: 88,
// 	},
// 	{
// 		name: "Zeta Zealots",
// 		players: ["player26", "player27", "player28", "player29", "player30"],
// 		location: "Boston",
// 		supportedGames: ["Dota 2", "Counter-Strike"],
// 		skillLevel: 75,
// 	},
// 	{
// 		name: "Eta Enforcers",
// 		players: ["player31", "player32", "player33", "player34", "player5"],
// 		location: "New York",
// 		supportedGames: ["League of Legends", "Valorant"],
// 		skillLevel: 83,
// 	},
// 	{
// 		name: "Theta Thrashers",
// 		players: ["player35", "player36", "player37", "player38", "player39"],
// 		location: "San Francisco",
// 		supportedGames: ["Fortnite", "Apex Legends", "Call of Duty"],
// 		skillLevel: 79,
// 	},
// 	{
// 		name: "Iota Immortals",
// 		players: ["player40", "player41", "player42", "player43", "player44"],
// 		location: "Austin",
// 		supportedGames: ["League of Legends", "Valorant"],
// 		skillLevel: 92,
// 	},
// 	{
// 		name: "Kappa Knights",
// 		players: ["player45", "player46", "player47", "player48", "player49"],
// 		location: "Denver",
// 		supportedGames: ["Counter-Strike", "Valorant"],
// 		skillLevel: 81,
// 	},
// 	{
// 		name: "Lambda Lords",
// 		players: ["player50", "player51", "player52", "player53", "player10"],
// 		location: "Los Angeles",
// 		supportedGames: ["League of Legends", "Dota 2"],
// 		skillLevel: 84,
// 	},
// 	{
// 		name: "Mu Marauders",
// 		players: ["player54", "player55", "player56", "player57", "player58"],
// 		location: "Philadelphia",
// 		supportedGames: ["Rocket League", "Fortnite"],
// 		skillLevel: 77,
// 	},
// 	{
// 		name: "Nu Ninjas",
// 		players: ["player59", "player60", "player61", "player62", "player63"],
// 		location: "Chicago",
// 		supportedGames: ["Valorant", "Counter-Strike"],
// 		skillLevel: 80,
// 	},
// 	{
// 		name: "Xi Xecutioners",
// 		players: ["player64", "player65", "player66", "player67", "player68"],
// 		location: "Houston",
// 		supportedGames: ["Apex Legends", "Call of Duty"],
// 		skillLevel: 86,
// 	},
// 	{
// 		name: "Omicron Overlords",
// 		players: ["player69", "player70", "player71", "player72", "player73"],
// 		location: "Seattle",
// 		supportedGames: ["League of Legends", "Dota 2"],
// 		skillLevel: 89,
// 	},
// 	{
// 		name: "Pi Punishers",
// 		players: ["player74", "player75", "player76", "player77", "player78"],
// 		location: "Atlanta",
// 		supportedGames: ["Valorant", "Counter-Strike", "Overwatch"],
// 		skillLevel: 76,
// 	},
// ]
const { LOCATION_OPTIONS } = require("../ServerUtils.js")
const {getPlayerData} = require("../api/server.js")
const {SkillLevelOptions} = require("../ServerUtils.js")
const nearbyLocationScores = {
	[LOCATION_OPTIONS.USA]: new Set([LOCATION_OPTIONS.CANADA, LOCATION_OPTIONS.MEXICO]),
	[LOCATION_OPTIONS.CANADA]: new Set([LOCATION_OPTIONS.USA, LOCATION_OPTIONS.MEXICO]),
	[LOCATION_OPTIONS.MEXICO]: new Set([LOCATION_OPTIONS.USA, LOCATION_OPTIONS.CANADA]),
	[LOCATION_OPTIONS.SOUTH_AMERICA]: new Set([LOCATION_OPTIONS.MEXICO]),
	[LOCATION_OPTIONS.EUROPE]: new Set([LOCATION_OPTIONS.ASIA]),
	[LOCATION_OPTIONS.AFRICA]: new Set(),
	[LOCATION_OPTIONS.ASIA]: new Set([LOCATION_OPTIONS.EUROPE]),
	[LOCATION_OPTIONS.OCEANIA]: new Set(),
}

const Weights = {
	LOCATION: 10,
	GAME: 15,
	LEVEL: 5,
	PLAYER: 20,
}

const SkillLevelScores = {
	[SkillLevelOptions.SEMI_PRO]: 10,
	[SkillLevelOptions.PRO]: 20,
	[SkillLevelOptions.ELITE]: 30,
}

const SKILL_LEVEL_RANGE = 10

async function calculateTeamSkillLevel(team) {
	let totalSkillLevel = 0
	for (const player of team.players) {
		const playerData = await getPlayerData(player)
		totalSkillLevel += playerData.skillLevel
	}
	return totalSkillLevel
}

/**
 * Placeholder function for calculating conflict score between two teams
 * @param {Object} team1 - First team
 * @param {Object} team2 - Second team
 * @returns {number} - Conflict score between the teams
 */
async function getConflictScore(team1, team2) {
	let score = 0

	score += Weights.LOCATION
	if (team1.location === team2.location) {
		score -= Weights.LOCATION
	} else if (nearbyLocationScores[team1.location].has(team2.location)) {
		score -= Weights.LOCATION / 2
	}

	score += Weights.LEVEL
	if (Math.abs(calculateTeamSkillLevel(team1) - calculateTeamSkillLevel(team2)) <= SKILL_LEVEL_RANGE) {
		score -= Weights.LEVEL
	}

	score += Weights.GAME
	if (team1.supportedGames.some((game) => team2.supportedGames.includes(game))) {
		score -= Weights.GAME
	}

	const setOfPlayers = new Set(team2.roster)
	const numberOfSharedPlayers = team1.filter((int) => setOfPlayers.has(int)).length
	score += Weights.PLAYER * numberOfSharedPlayers

	return score
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
	if (!teams || teams.length !== 16) {
		throw new Error("Tournament requires exactly 16 teams")
	}

	const conflictMatrix = await createConflictMatrix(teams)
	const matchups = createFirstRoundMatchups(teams, conflictMatrix)

	return matchups
}

module.exports = {
	getConflictScore,
	createConflictMatrix,
	createFirstRoundMatchups,
	generateTournamentMatchups,
}
