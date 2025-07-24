import {
	GameOptions,
	PlaystyleOptions,
	SkillLevelOptions,
	YearsOfExperienceOptions,
	LOCATION_OPTIONS,
} from "../ServerUtils.js"

export const AllSignals = {}

export function updateLocationWeights(
	increment,
	recommendationStatistics,
	MAX_VALUE,
	team
) {
	const locationWeights = recommendationStatistics.favorabilityWeights.locations
	const locationWeight = locationWeights[team.location]
	locationWeights[team.location] = Math.min(locationWeight + increment, MAX_VALUE)
	return recommendationStatistics
}

export function updatePlaystyleWeights(
	increment,
	recommendationStatistics,
	MAX_VALUE,
	team
) {
	for (const playstyle of team.desiredPlaystyle) {
		const playstyleWeights = recommendationStatistics.favorabilityWeights.playstyles
		const playstyleWeight = playstyleWeights[playstyle]
        playstyleWeights[playstyle] = Math.min(playstyleWeight + increment, MAX_VALUE)
	}
	// const playstyleWeight = recommendationStatistics.favorabilityWeights.playstyles[team.desiredPlaystyle]
	// locationWeight = Math.min(playstyleWeight + increment, MAX_VALUE)
	// return playstyleWeight
}

export function updateSkillLevelWeights(
	increment,
	recommendationStatistics,
	MAX_VALUE,
	team
) {
	const skillLevelWeights = recommendationStatistics.favorabilityWeights.skillLevels
	const skillLevelWeight = skillLevelWeights[team.desiredSkillLevel]
	skillLevelWeights[team.desiredPlaystyle] = Math.min(
		skillLevelWeight + increment,
		MAX_VALUE
	)
	return recommendationStatistics
}

export function updateAllWeights() {}
