import { translateExperience, YearsOfExperienceOptions } from "./utils.js"
const GameOptions = {
	VALORANT: "Valorant",
	FORTNITE: "Fortnite",
	APEX_LEGENDS: "Apex Legends",
}
const PlaystyleOptions = {
	AGGRESSIVE: "Aggressive",
	DEFENSIVE: "Defensive",
	ADAPTIVE: "Adaptive",
}
const SkillLevelOptions = {
	SEMI_PRO: "Semi-Pro",
	PRO: "Pro",
	ELITE: "Elite",
}
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
export const LOCATION_OPTIONS = {
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
	const playerSkillLevel = translateExperience(playerInfo.yearsOfExperience)

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

		return true
	})

	return eligibleTeams
}

function calculateLocationScore(playerLocation, teamLocation) {
    if (playerLocation === teamLocation) {
        return 1
    } else if (nearbyLocationScores[playerLocation].has(teamLocation)) {
        return 0.5
    } else {
        return 0
    }
}

function calculateSkillLevelScore(playerSkillLevel, teamSkillLevel) {
    if (playerSkillLevel === teamSkillLevel) {
        return 1
    } else {
        return 0
    }
}

function calculatePlaystyleScore(playerPlaystyle, teamPlaystyles) {
    if (teamPlaystyles.includes(playerPlaystyle)) {
        return 1
    } else {
        return 0
    }
}

function calculateTeamScore(playerInfo, eligibleTeam) {
    let finalScore = 0
    const playerSkillLevel = translateExperience(playerInfo.yearsOfExperience)
    finalScore += calculateLocationScore(playerInfo.location, eligibleTeam.location) * weights.location
    finalScore += calculateSkillLevelScore(playerSkillLevel, eligibleTeam.desiredSkillLevel) * weights.skillLevel
    finalScore += calculatePlaystyleScore(playerInfo.playstyle, eligibleTeam.desiredPlaystyle) * weights.playstyle
    return finalScore
}

function reccommendationAlgorithm(playerInfo, teams) {
    const eligibleTeams = filterIneligibleTeams(playerInfo, teams)
    let teamScores = []
    for (const team of eligibleTeams) {
        const score = calculateTeamScore(playerInfo, team)
        teamScores.push({ team: team, score: score })
    }
    teamScores.sort((a, b) => b.score - a.score)
    return teamScores
}


const rankedTeams = reccommendationAlgorithm(generatedPlayerInfo1, teams)
