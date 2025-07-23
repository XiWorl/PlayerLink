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

export const TournamentSchedulingWeights = {
	LOCATION: 10,
	GAME: 15,
	SKILL_LEVEL: 5,
	PLAYER: 20,
}

export const SkillLevelScores = {
	[SkillLevelOptions.SEMI_PRO]: 10,
	[SkillLevelOptions.PRO]: 20,
	[SkillLevelOptions.ELITE]: 30,
}
