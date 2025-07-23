import { NearbyLocations } from "../ServerUtils.js"

export function calculateLocationScore(playerLocation, teamLocation) {
	if (playerLocation === teamLocation) {
		return 1
	} else if (NearbyLocations[playerLocation].has(teamLocation)) {
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
