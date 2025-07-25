const { PrismaClient } = require("../generated/prisma")
const { AccountType } = require("../ServerUtils")
const {
	createEmptyTournamentRoundsJson,
} = require("../tournamentScheduling/algorithmUtils")
const { generateTournamentMatchups } = require("../tournamentScheduling/algorithm")
const { getAccountData } = require("./endpointsUtils")
const prisma = new PrismaClient()

const TOURNAMENT_NAME = "Tournament"
const TOURNAMENT_ROUND = "round"
const FIRST_ROUND_OF_TOURNAMENT = 1

async function getTournament(tournamentId) {
	try {
		const tournamentInformation = await prisma.tournament.findUnique({
			where: {
				tournamentId: tournamentId,
			},
		})
		return tournamentInformation
	} catch (error) {
		return null
	}
}

async function getAllTournaments() {
	try {
		const allTournaments = await prisma.tournament.findMany()
		return allTournaments
	} catch (error) {
		return null
	}
}

function getNumberOfMatchupsInRound(roundNumber, maximumNumberOfParticipants) {
	const remainingTeamsInTournamentBasedOnRound =
		maximumNumberOfParticipants / Math.pow(2, roundNumber)
	return remainingTeamsInTournamentBasedOnRound
}

async function updateTournament(tournamentId, tournamentData) {
	try {
		const updatedTournament = await prisma.tournament.update({
			where: { tournamentId: tournamentId },
			data: tournamentData,
		})
		return updatedTournament
	} catch (error) {
		return null
	}
}

async function createTournament(teamData, globalTournamentId, MININUM_NUMBER_OF_TEAMS) {
	try {
		const roundsJson = createEmptyTournamentRoundsJson(MININUM_NUMBER_OF_TEAMS)

		const createdTournament = await prisma.tournament.create({
			data: {
				creatorAccountId: teamData.accountId,
				name: TOURNAMENT_NAME,
				rounds: roundsJson,
				minimumParticipants: MININUM_NUMBER_OF_TEAMS,
				isActive: false,
				participantsAdvancedToNextRound: {},
				allTournaments: {
					connect: { id: globalTournamentId },
				},
				allParticipants: {},
			},
		})

		const tournamentId = createdTournament.tournamentId
		const tournamentUpdate = {
			name: TOURNAMENT_NAME + " " + tournamentId,
			allParticipants: {
				[teamData.accountId]: teamData,
			},
		}
		const finalizedTournament = await updateTournament(tournamentId, tournamentUpdate)

		await prisma.tournaments.update({
			where: { id: globalTournamentId },
			data: {
				tournamentIds: {
					push: tournamentId,
				},
			},
		})

		return finalizedTournament
	} catch (error) {
		console.log(error)
		return null
	}
}

async function advanceTournamentRound(tournamentId) {
	try {
		const tournamentInformation = await getTournament(tournamentId)
		const nextRoundParticipants =
			tournamentInformation.participantsAdvancedToNextRound
		const currentRound = tournamentInformation.currentRound

		const matchupsPerRound = getNumberOfMatchupsInRound(
			currentRound,
			Object.keys(tournamentInformation.allParticipants).length
		)

		if (Object.keys(nextRoundParticipants).length >= matchupsPerRound) {
			const nextRound = currentRound + 1
			const nextRoundText = TOURNAMENT_ROUND + nextRound

			const nextRoundTournamentData = {
				currentRound: nextRound,
				rounds: {
					...tournamentInformation.rounds,
					[nextRoundText]: [nextRoundParticipants],
				},
			}

			await updateTournament(tournamentId, nextRoundTournamentData)
			const roundMatchups = await generateTournamentMatchups(nextRoundParticipants)
			const nextRoundMatchupsData = {
				currentRound: nextRound,
				rounds: {
					...nextRoundTournamentData.rounds,
					[nextRoundText]: roundMatchups,
				},
				participantsAdvancedToNextRound: {},
			}

			const tournamentWithMatchups = await updateTournament(
				tournamentId,
				nextRoundMatchupsData
			)

			return tournamentWithMatchups
		}
		return null
	} catch (error) {
		return null
	}
}

async function advanceTeamInTournament(tournamentId, teamAccountId) {
	try {
		const tournamentInformation = await getTournament(tournamentId)
		const teamData = await getAccountData(teamAccountId, AccountType.TEAM)
		const teamData = await getAccountData(teamAccountId, AccountType.TEAM)

		if (
			tournamentInformation.isActive == false ||
			!tournamentInformation.allParticipants[teamAccountId] ||
			tournamentInformation.participantsAdvancedToNextRound[teamAccountId] ||
			!tournamentInformation.allParticipants[teamAccountId] ||
			tournamentInformation.participantsAdvancedToNextRound[teamAccountId] ||
			teamData == null
		) {
			return null
		}

		teamData.advancedAt = Date.now()

		teamData.advancedAt = Date.now()

		const addTeamToNextRound = {
			participantsAdvancedToNextRound: {
				...tournamentInformation.participantsAdvancedToNextRound,
				[teamAccountId]: teamData,
			},
		}


		const tournamentWithAdvancingTeam = await updateTournament(
			tournamentId,
			addTeamToNextRound
		)

		return tournamentWithAdvancingTeam
	} catch (error) {
		return null
	}
}

async function joinTournament(tournamentId, teamId) {
	try {
		const tournamentInformation = await getTournament(tournamentId)
		const teamData = await getAccountData(teamAccountId, AccountType.TEAM)
		const teamData = await getAccountData(teamAccountId, AccountType.TEAM)

		if (
			tournamentInformation.isActive == false ||
			!tournamentInformation.allParticipants[req.body.accountId] ||
			tournamentInformation.participantsAdvancedToNextRound[accountId] ||
			teamData == null
		) {
			return null
		}

		const addTeamToTournament = {
			allParticipants: {
				...tournamentInformation.allParticipants,
				[teamId]: [teamData],
			},
		}
		const tournamentWithJoinedTeam = await updateTournament(
			tournamentId,
			addTeamToTournament
		)
		return tournamentWithJoinedTeam
	} catch (error) {
		return null
	}
}

async function startTournament(tournamentId) {
	try {
		const tournamentInformation = await getTournament(tournamentId)
		const startingMatchups = await generateTournamentMatchups(
			tournamentInformation.allParticipants
		)
		const updatedRounds = tournamentInformation.rounds
		updatedRounds[TOURNAMENT_ROUND + FIRST_ROUND_OF_TOURNAMENT] = startingMatchups

		const updatedTournamentData = {
			rounds: updatedRounds,
			isActive: true,
		}

		const updatedTournament = await updateTournament(
			tournamentId,
			updatedTournamentData
		)
		return updatedTournament
	} catch (error) {
		return null
	}
}

module.exports = {
	getTournament,
	updateTournament,
	getNumberOfMatchupsInRound,
	createTournament,
	advanceTeamInTournament,
	advanceTournamentRound,
	getAllTournaments,
	startTournament,
	joinTournament,
}
