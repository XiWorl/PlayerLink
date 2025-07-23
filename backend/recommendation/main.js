import {
	calculateLocationScore,
	calculateSkillLevelScore,
	calculatePlaystyleScore,
} from "./utils.js"
import { translateExperience } from "../ServerUtils.js"

const Weights = {
	LOCATION: 2,
	SKILL_LEVEL: 1.2,
	PLAYSTYLE: 0.8,
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
		Weights.LOCATION
	finalScore +=
		calculateSkillLevelScore(playerSkillLevel, eligibleTeam.desiredSkillLevel) *
		Weights.SKILL_LEVEL
	finalScore +=
		calculatePlaystyleScore(playerInfo.playstyle, eligibleTeam.desiredPlaystyle) *
		Weights.PLAYSTYLE

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

export function getTeamRecommendations(playerInfo, teams) {
	const rankedTeams = recommendationAlgorithm(playerInfo, teams)
	const firstTenRankedTeams = rankedTeams.slice(0, 10)
	return firstTenRankedTeams
}
