/**
 * Team Recommendation Algorithm
 *
 * This algorithm recommends teams to players based on their preferences and interactions.
 * It takes into account location, skill level, playstyle, and profile visits.
 */

// Constants for weight calculations
const WeightUpdateIncrement = {
	BASE_VALUE: 0.05, // Base value for weight increments
	DECAY_RATE: 0.025, // Rate at which weight increments decay with subsequent visits
}

// Weights for different team attributes in the recommendation score
const TeamAttributeWeight = {
	LOCATION_WEIGHT: 0.4, // Weight for location match
	SKILL_LEVEL_WEIGHT: 0.3, // Weight for skill level match
	PLAYSTYLE_WEIGHT: 0.3, // Weight for playstyle match
}

// Min and max values for favorability weights
const LocationFavorabilityWeight = {
	MIN_WEIGHT: 0,
	MAX_WEIGHT: 1,
}

const SkillLevelFavorabilityWeight = {
	MIN_WEIGHT: 0,
	MAX_WEIGHT: 1,
}

const PlaystyleFavorabilityWeight = {
	MIN_WEIGHT: 0,
	MAX_WEIGHT: 1,
}

// Threshold for profile visits to start affecting weights
const ProfileVisitThreshold = {
	MIN_VISITS: 3,
}

// Initial weight value for favorability weights
const INITIAL_WEIGHT_VALUE = 0.5

/**
 * Calculate the location favorability weight based on player and team locations
 * @param {string} playerLocation - The player's location
 * @param {string} teamLocation - The team's location
 * @param {Object} favorabilityWeights - The player's favorability weights
 * @returns {number} - The location favorability weight
 */
function calculateLocationFavorabilityWeight(
	playerLocation,
	teamLocation,
	favorabilityWeights
) {
	// If player and team locations match, return the maximum weight
	if (playerLocation === teamLocation) {
		return LocationFavorabilityWeight.MAX_WEIGHT
	}

	// Otherwise, return the player's favorability weight for the team's location
	return (
		favorabilityWeights.locations[teamLocation] ||
		LocationFavorabilityWeight.MIN_WEIGHT
	)
}

/**
 * Calculate the skill level favorability weight based on player and team skill levels
 * @param {string} playerSkillLevel - The player's skill level
 * @param {string} teamDesiredSkillLevel - The team's desired skill level
 * @param {Object} favorabilityWeights - The player's favorability weights
 * @returns {number} - The skill level favorability weight
 */
function calculateSkillLevelFavorabilityWeight(
	playerSkillLevel,
	teamDesiredSkillLevel,
	favorabilityWeights
) {
	// If player and team skill levels match, return the maximum weight
	if (playerSkillLevel === teamDesiredSkillLevel) {
		return SkillLevelFavorabilityWeight.MAX_WEIGHT
	}

	// Otherwise, return the player's favorability weight for the team's desired skill level
	return (
		favorabilityWeights.skillLevels[teamDesiredSkillLevel] ||
		SkillLevelFavorabilityWeight.MIN_WEIGHT
	)
}

/**
 * Calculate the playstyle favorability weight based on player and team playstyles
 * @param {string} playerPlaystyle - The player's playstyle
 * @param {string[]} teamDesiredPlaystyles - The team's desired playstyles
 * @param {Object} favorabilityWeights - The player's favorability weights
 * @returns {number} - The playstyle favorability weight
 */
function calculatePlaystyleFavorabilityWeight(
	playerPlaystyle,
	teamDesiredPlaystyles,
	favorabilityWeights
) {
	// If the team's desired playstyles include the player's playstyle, return the maximum weight
	if (teamDesiredPlaystyles.includes(playerPlaystyle)) {
		return PlaystyleFavorabilityWeight.MAX_WEIGHT
	}

	// If the team has multiple desired playstyles, calculate the average favorability weight
	if (teamDesiredPlaystyles.length > 0) {
		const totalWeight = teamDesiredPlaystyles.reduce((sum, playstyle) => {
			return (
				sum +
				(favorabilityWeights.playstyle[playstyle] ||
					PlaystyleFavorabilityWeight.MIN_WEIGHT)
			)
		}, 0)

		return totalWeight / teamDesiredPlaystyles.length
	}

	return PlaystyleFavorabilityWeight.MIN_WEIGHT
}

/**
 * Calculate the weight increment based on the number of profile visits
 * @param {number} profileVisits - The number of profile visits
 * @returns {number} - The weight increment
 */
function calculateWeightIncrement(profileVisits) {
	// For the first visit, return the base value
	if (profileVisits === 1) {
		return WeightUpdateIncrement.BASE_VALUE
	}

	// For subsequent visits, apply the decay rate
	const decayFactor = Math.pow(1 - WeightUpdateIncrement.DECAY_RATE, profileVisits - 1)
	return WeightUpdateIncrement.BASE_VALUE * decayFactor
}

/**
 * Update the favorability weights based on profile visits
 * @param {Object} favorabilityWeights - The current favorability weights
 * @param {Object} team - The team object
 * @param {number} profileVisits - The number of profile visits
 * @returns {Object} - The updated favorability weights
 */
function updateFavorabilityWeights(favorabilityWeights, team, profileVisits) {
	// Only update weights if the number of profile visits exceeds the threshold
	if (profileVisits < ProfileVisitThreshold.MIN_VISITS) {
		return favorabilityWeights
	}

	const weightIncrement = calculateWeightIncrement(profileVisits)
	const updatedWeights = JSON.parse(JSON.stringify(favorabilityWeights))

	// Update location weight
	const locationWeight = updatedWeights.locations[team.location] || 0
	updatedWeights.locations[team.location] = Math.min(
		LocationFavorabilityWeight.MAX_WEIGHT,
		locationWeight + weightIncrement
	)

	// Update skill level weight
	const skillLevelWeight = updatedWeights.skillLevels[team.desiredSkillLevel] || 0
	updatedWeights.skillLevels[team.desiredSkillLevel] = Math.min(
		SkillLevelFavorabilityWeight.MAX_WEIGHT,
		skillLevelWeight + weightIncrement
	)

	// Update playstyle weights
	team.desiredPlaystyle.forEach((playstyle) => {
		const playstyleWeight = updatedWeights.playstyle[playstyle] || 0
		updatedWeights.playstyle[playstyle] = Math.min(
			PlaystyleFavorabilityWeight.MAX_WEIGHT,
			playstyleWeight + weightIncrement
		)
	})

	return updatedWeights
}

/**
 * Calculate the recommendation score for a player and team
 * @param {Object} player - The player object
 * @param {Object} team - The team object
 * @param {Object} interactions - The player's interactions with teams
 * @returns {number} - The recommendation score
 */
function calculateRecommendationScore(player, team, interactions) {
	const favorabilityWeights = player.recommendationStatistics.favorabilityWeights

	// Calculate individual favorability weights
	const locationWeight = calculateLocationFavorabilityWeight(
		player.location,
		team.location,
		favorabilityWeights
	)

	const skillLevelWeight = calculateSkillLevelFavorabilityWeight(
		player.skillLevel,
		team.desiredSkillLevel,
		favorabilityWeights
	)

	const playstyleWeight = calculatePlaystyleFavorabilityWeight(
		player.playstyle,
		team.desiredPlaystyle,
		favorabilityWeights
	)

	// Calculate the weighted sum
	const score =
		TeamAttributeWeight.LOCATION_WEIGHT * locationWeight +
		TeamAttributeWeight.SKILL_LEVEL_WEIGHT * skillLevelWeight +
		TeamAttributeWeight.PLAYSTYLE_WEIGHT * playstyleWeight

	// Adjust score based on team interactions
	const teamInteraction = interactions[team.accountId]
	if (teamInteraction) {
		// If the player has declined a recommendation from this team, reduce the score
		if (teamInteraction.declinedRecommendation) {
			return score * 0.5 // Reduce score by 50%
		}

		// If the player has been rejected from this team, reduce the score
		if (teamInteraction.rejectedFromTeam) {
			return score * 0.3 // Reduce score by 70%
		}
	}

	return score
}

/**
 * Generate team recommendations for a player
 * This is the main function that takes a player and returns recommended teams
 * @returns {Array} - Array of recommended teams with scores, sorted by score in descending order
 */
function recommendTeams(player, teams) {
	// In a real implementation, you would retrieve the player data from the database
	// const player = await getPlayerData(playerAccountId);

	// In a real implementation, you would retrieve all eligible teams from the database
	// const teams = await getEligibleTeams();

	// Filter out teams that the player is already a member of
	const eligibleTeams = teams.filter(
		(team) => !player.rosterAccountIds.includes(team.accountId)
	)

	// Calculate recommendation scores for each team
	const recommendedTeams = eligibleTeams.map((team) => {
		const score = calculateRecommendationScore(
			player,
			team,
			player.recommendationStatistics.interactions
		)

		return {
			team,
			score,
		}
	})

	// Sort teams by recommendation score in descending order
	recommendedTeams.sort((a, b) => b.score - a.score)

	return recommendedTeams
}

/**
 * Create default recommendation statistics for a new player
 * @returns {Object} - Default recommendation statistics
 */
function createDefaultRecommendationStatistics(
	locationOptions,
	skillLevelOptions,
	playstyleOptions
) {
	// Create default favorability weights for locations
	const locationWeights = {}
	Object.values(locationOptions).forEach((location) => {
		locationWeights[location] = INITIAL_WEIGHT_VALUE
	})

	// Create default favorability weights for skill levels
	const skillLevelWeights = {}
	Object.values(skillLevelOptions).forEach((skillLevel) => {
		skillLevelWeights[skillLevel] = INITIAL_WEIGHT_VALUE
	})

	// Create default favorability weights for playstyles
	const playstyleWeights = {}
	Object.values(playstyleOptions).forEach((playstyle) => {
		playstyleWeights[playstyle] = INITIAL_WEIGHT_VALUE
	})

	return {
		favorabilityWeights: {
			locations: locationWeights,
			skillLevels: skillLevelWeights,
			playstyle: playstyleWeights,
		},
		interactions: {},
	}
}

/**
 * Process a player's profile visit to a team
 * This function updates the player's recommendation statistics based on a profile visit
 *
 * @param {Object} player - The player object
 * @param {Object} team - The team object
 * @param {number} profileVisits - The number of profile visits
 * @returns {Object} - Updated favorability weights
 */
function processProfileVisit(player, team, profileVisits) {
	// In a real implementation, you would retrieve the current profile visit count
	// const profileVisits = await getProfileVisitCount(playerAccountId, teamAccountId);

	// Update the favorability weights based on the profile visits
	const updatedWeights = updateFavorabilityWeights(
		player.recommendationStatistics.favorabilityWeights,
		team,
		profileVisits
	)

	// In a real implementation, you would save the updated weights to the database
	// await saveUpdatedWeights(playerAccountId, updatedWeights);

	return updatedWeights
}

export {
	recommendTeams,
	calculateRecommendationScore,
	calculateLocationFavorabilityWeight,
	calculateSkillLevelFavorabilityWeight,
	calculatePlaystyleFavorabilityWeight,
	updateFavorabilityWeights,
	processProfileVisit,
	createDefaultRecommendationStatistics,
}
