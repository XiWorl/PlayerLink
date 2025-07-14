const {
	translateExperience,
	calculateLocationScore,
	calculateSkillLevelScore,
	YearsOfExperienceOptions,
	calculatePlaystyleScore,
} = require("./utils.js")
const {
	GameOptions,
	PlaystyleOptions,
	SkillLevelOptions,
} = require("../ServerUtils.js")

const generatedTeamInfo1 = {
	name: "Unlimited Range Gaming",
	location: "US",
	description: "FPS focused e-sports Team",
	overview:
		"We are a team of FPS players looking to expand our reach and grow our community.",
	currentlyHiring: true,
	supportedGames: [GameOptions.APEX_LEGENDS],
	desiredSkillLevel: SkillLevelOptions.ELITE,
	desiredPlaystyle: [PlaystyleOptions.DEFENSIVE],
}
const generatedTeamInfo2 = {
	name: "Unlimited Range Gaming2",
	location: "US",
	description: "FPS focused e-sports Team",
	overview:
		"We are a team of FPS players looking to expand our reach and grow our community.",
	currentlyHiring: true,
	supportedGames: [
		GameOptions.APEX_LEGENDS,
		GameOptions.FORTNITE,
		GameOptions.VALORANT,
	],
	desiredSkillLevel: SkillLevelOptions.SEMI_PRO,
	desiredPlaystyle: [
		PlaystyleOptions.ADAPTIVE,
		PlaystyleOptions.DEFENSIVE,
		PlaystyleOptions.ADAPTIVE,
	],
}

const generatedPlayerInfo1 = {
	firstName: "Billy",
	lastName: "Bob",
	yearsOfExperience: YearsOfExperienceOptions.ZERO_TO_ONE,
	location: "US",
	willingToRelocate: false,
	bio: "#1 ranked player in the US | FPS certified | Full-time",
	about: "Hello!, I'm a FPS player looking to expand my reach and grow my community. I'm currently looking for a team to join and help me achieve my goals.",
	gamingExperience: [GameOptions.APEX_LEGENDS, GameOptions.FORTNITE],
	playstyle: PlaystyleOptions.ADAPTIVE,
	gameUsernames: { Valorant: "username here for val" },
}
const LOCATION_OPTIONS = {
	USA: "USA",
	CANADA: "Canada",
	MEXICO: "Mexico",
	SOUTH_AMERICA: "South America",
	EUROPE: "Europe",
	AFRICA: "Africa",
	ASIA: "Asia",
	OCEANIA: "Oceania",
}

const teams = [generatedTeamInfo1, generatedTeamInfo2]

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

const weights = {
	location: 2,
	skillLevel: 1.2,
	playstyle: 0.8,
}

function filterIneligibleTeams(playerInfo, teams) {
	const eligibleTeams = teams.filter((team) => {
		if (!team.currentlyHiring) {
			return false
		}

		const hasMatchingGame = playerInfo.gamingExperience.some((game) =>
			team.supportedGames.includes(game)
		)
		if (!hasMatchingGame) {
			return false
		}

		if (
			playerInfo.willingToRelocate == false &&
			team.location !== playerInfo.location
		) {
			return false
		}

		return true
	})

	return eligibleTeams
}

function calculateTeamScore(playerInfo, eligibleTeam) {
	let finalScore = 0
	const playerSkillLevel = translateExperience(playerInfo.yearsOfExperience)
	finalScore +=
		calculateLocationScore(playerInfo.location, eligibleTeam.location) *
		weights.location
	finalScore +=
		calculateSkillLevelScore(playerSkillLevel, eligibleTeam.desiredSkillLevel) *
		weights.skillLevel
	finalScore +=
		calculatePlaystyleScore(playerInfo.playstyle, eligibleTeam.desiredPlaystyle) *
		weights.playstyle
	return finalScore
}

function recommendationAlgorithm(playerInfo, teams) {
	const eligibleTeams = filterIneligibleTeams(playerInfo, teams)
	let teamScores = []
	for (const team of eligibleTeams) {
		const score = calculateTeamScore(playerInfo, team)
		teamScores.push({ team: team, score: score })
	}
	teamScores.sort((a, b) => b.score - a.score)
	return teamScores
}

const rankedTeams = recommendationAlgorithm(generatedPlayerInfo1, teams)
const firstTenRankedTeams = rankedTeams.slice(0, 10)

console.log(firstTenRankedTeams)
