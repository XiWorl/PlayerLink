import { LOCATION_OPTIONS } from "../ServerUtils.js"
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

export const YearsOfExperienceOptions = Object.freeze({
	ZERO_TO_ONE: "0-1",
	TWO_TO_THREE: "2-3",
	FOUR_TO_FIVE: "4-5",
	SIX_TO_TEN: "6-10",
	TENPLUS: "10+",
})

export function translateExperience(yearsOfExperience) {
    if (yearsOfExperience === YearsOfExperienceOptions.ZERO_TO_ONE || yearsOfExperience === YearsOfExperienceOptions.TWO_TO_THREE) {
        return "Semi-Pro"
    } else if (yearsOfExperience === YearsOfExperienceOptions.FOUR_TO_FIVE || yearsOfExperience === YearsOfExperienceOptions.SIX_TO_TEN) {
        return "Pro"
    } else if (yearsOfExperience === YearsOfExperienceOptions.TENPLUS) {
        return "Elite"
    }
}

export function calculateLocationScore(playerLocation, teamLocation) {
    if (playerLocation === teamLocation) {
        return 1
    } else if (nearbyLocationScores[playerLocation].has(teamLocation)) {
        return 0.5
    } else {
        return 0
    }
}

export function calculateSkillLevelScore(playerSkillLevel, teamSkillLevel) {
    if (playerSkillLevel === teamSkillLevel) {
        return 1
    } else {
        return 0
    }
}

export function calculatePlaystyleScore(playerPlaystyle, teamPlaystyles) {
    if (teamPlaystyles.includes(playerPlaystyle)) {
        return 1
    } else {
        return 0
    }
}
