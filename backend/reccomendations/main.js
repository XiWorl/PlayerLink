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
	desiredSkillLevel: [
		SkillLevelOptions.SEMI_PRO,
		SkillLevelOptions.PRO,
		SkillLevelOptions.ELITE,
	],
	desiredPlaystyle: [PlaystyleOptions.ADAPTIVE],
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
	desiredSkillLevel: [SkillLevelOptions.PRO, SkillLevelOptions.ELITE, SkillLevelOptions.SEMI_PRO],
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
const teams = [generatedTeamInfo1, generatedTeamInfo2]

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

		if (!team.desiredSkillLevel.includes(playerSkillLevel)) {
			return false
		}

		return true
	})

	return eligibleTeams
}

filterIneligibleTeams(generatedPlayerInfo1, teams)
