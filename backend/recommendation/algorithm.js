const WeightUpdateIncrement = {
	BASE_VALUE: 0.05,
	DECAY_RATE: 0.025,
}
const TeamAttributeWeight = {
	LOCATION_WEIGHT: 0.4,
	SKILL_LEVEL_WEIGHT: 0.3,
	PLAYSTYLE_WEIGHT: 0.3,
}
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
const ProfileVisitThreshold = {
	MIN_VISITS: 3,
}

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
 * @param {Object} player - The player object
 * @param {Object} team - The team object
 * @param {number} profileVisits - The number of profile visits
 * @returns {Object} - The updated favorability weights
 */
function updateFavorabilityWeights(player, team, profileVisits) {
	// Only update weights if the number of profile visits exceeds the threshold
	if (profileVisits < ProfileVisitThreshold.MIN_VISITS) {
		return player.recommendationStatistics.favorabilityWeights
	}

	const weightIncrement = calculateWeightIncrement(profileVisits)
	const updatedWeights = JSON.parse(
		JSON.stringify(player.recommendationStatistics.favorabilityWeights)
	)

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
 * @returns {number} - The recommendation score
 */
function calculateRecommendationScore(player, team) {
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

	// Adjust score based on team recommendation history
	const teamInteractions = player.recommendationStatistics.interactions[team.accountId]
	if (teamInteractions) {
		// If the player has declined a recommendation from this team, reduce the score
		if (teamInteractions.declinedRecommendation) {
			return score * 0.5 // Reduce score by 50%
		}

		// If the player has been rejected from this team, reduce the score
		if (teamInteractions.rejectedFromTeam) {
			return score * 0.3 // Reduce score by 70%
		}
	}

	return score
}

/**
 * Generate team recommendations for a player
 * @param {Object} player - The player object
 * @param {Array} teams - The list of teams
 * @returns {Array} - The list of recommended teams with scores
 */
function generateTeamRecommendations(player, teams) {
	// Filter out teams that the player is already a member of
	const eligibleTeams = teams.filter(
		(team) => !player.rosterAccountIds.includes(team.accountId)
	)

	// Calculate recommendation scores for each team
	const recommendedTeams = eligibleTeams.map((team) => {
		const score = calculateRecommendationScore(player, team)
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
 * Process a player's profile visit to a team
 * @param {Object} player - The player object
 * @param {Object} team - The team object
 * @returns {Object} - The updated player object with updated recommendation statistics
 */
function processProfileVisit(player, team) {
	const updatedPlayer = JSON.parse(JSON.stringify(player))

	// Initialize or update the team interactions
	if (!updatedPlayer.recommendationStatistics.interactions[team.accountId]) {
		updatedPlayer.recommendationStatistics.interactions[team.accountId] = {
			profileVisits: 1,
			declinedRecommendation: false,
			memberOfTeam: false,
			rejectedFromTeam: false,
		}
	} else {
		updatedPlayer.recommendationStatistics.interactions[
			team.accountId
		].profileVisits += 1
	}

	const profileVisits =
		updatedPlayer.recommendationStatistics.interactions[team.accountId].profileVisits

	// Update favorability weights based on profile visits
	updatedPlayer.recommendationStatistics.favorabilityWeights =
		updateFavorabilityWeights(updatedPlayer, team, profileVisits)

	return updatedPlayer
}

/**
 * Process a player's declined recommendation for a team
 * @param {Object} player - The player object
 * @param {Object} team - The team object
 * @returns {Object} - The updated player object with updated recommendation statistics
 */
function processDeclinedRecommendation(player, team) {
	const updatedPlayer = JSON.parse(JSON.stringify(player))

	// Initialize or update the team interactions
	if (!updatedPlayer.recommendationStatistics.interactions[team.accountId]) {
		updatedPlayer.recommendationStatistics.interactions[team.accountId] = {
			profileVisits: 0,
			declinedRecommendation: true,
			memberOfTeam: false,
			rejectedFromTeam: false,
		}
	} else {
		updatedPlayer.recommendationStatistics.interactions[
			team.accountId
		].declinedRecommendation = true
	}

	// Update team's recommendation history
	if (!team.recommendationHistory.interactions[player.accountId]) {
		team.recommendationHistory.interactions[player.accountId] = {
			declinedRecommendation: true,
		}
	} else {
		team.recommendationHistory.interactions[
			player.accountId
		].declinedRecommendation = true
	}

	return updatedPlayer
}

export {
	generateTeamRecommendations,
	processProfileVisit,
	processDeclinedRecommendation,
	calculateRecommendationScore,
	calculateLocationFavorabilityWeight,
	calculateSkillLevelFavorabilityWeight,
	calculatePlaystyleFavorabilityWeight,
	updateFavorabilityWeights,
}
