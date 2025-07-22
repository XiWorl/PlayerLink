import { YearsOfExperienceOptions } from "../ServerUtils.js"
export const MININUM_NUMBER_OF_TEAMS = 16
const ROUND_PROPERTY_NAME = "round"
const INITIAL_ROUND = 1

export function calculateRoundsFromNumberOfTeams(numberOfTeams) {
	if ((numberOfTeams & (numberOfTeams - 1)) !== 0) {
		return -1
	}
	const rounds = Math.log2(numberOfTeams)
	return parseInt(rounds)
}

export function createRoundsJson(numberOfTeams) {
	const numberOfRounds = calculateRoundsFromNumberOfTeams(numberOfTeams)
    const rounds = {}
	if (numberOfRounds === -1) {
		return {}
    }

    for (let i = 1; i < numberOfRounds + INITIAL_ROUND; i++) {
        rounds[ROUND_PROPERTY_NAME + i] = []
    }
    return rounds
}

export function translateExperience(yearsOfExperience) {
    if (yearsOfExperience === YearsOfExperienceOptions.ZERO_TO_ONE || yearsOfExperience === YearsOfExperienceOptions.TWO_TO_THREE) {
        return "Semi-Pro"
    } else if (yearsOfExperience === YearsOfExperienceOptions.FOUR_TO_FIVE || yearsOfExperience === YearsOfExperienceOptions.SIX_TO_TEN) {
        return "Pro"
    } else if (yearsOfExperience === YearsOfExperienceOptions.TENPLUS) {
        return "Elite"
    }
}
