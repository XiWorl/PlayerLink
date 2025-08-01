import { PrismaClient } from "../generated/prisma/index.js"
const prisma = new PrismaClient()
import { createTournament, joinTournament } from "../api/tournamentUtils.js"

async function createNewTournament(teamData) {
	const result = await prisma.tournaments.findMany()
	const globalTournamentId = result[result.length - 1].id

	const newTournament = await createTournament(teamData, globalTournamentId, 16)
	return newTournament
}

async function joinTournamentWithId(tournamentId, teamAccountId) {
	const joinedTournamentData = await joinTournament(tournamentId, teamAccountId)
	return joinedTournamentData
}

async function createApplication(playerAccountId, teamAccountId) {
    const status = "pending"
	const playerApplicationToTeam = await prisma.application.findUnique({
		where: {
			playerAccountId_teamAccountId: {
				playerAccountId: playerAccountId,
				teamAccountId: teamAccountId,
			},
		},
	})

	const createdApplication = await prisma.application.create({
		data: {
			playerAccountId: playerAccountId,
			teamAccountId: teamAccountId,
			status: status,
		},
	})
	return createdApplication
}

async function applyToUsersTeam(teamAccountId) {
	for (let i = 1; i < 6; i++) {
		const playerData = await prisma.player.findUnique({ where: { playerId: i } })
        const application = await createApplication(playerData.accountId, teamAccountId)
	}
}

async function populateTournamentWithTeams(tournamentId) {
	const allTeams = await prisma.team.findMany()
	for (const team of allTeams) {
		if (team.rosterAccountIds.length === 0) continue
		await joinTournament(tournamentId, team.accountId)
	}
}

populateTournamentWithTeams(1)

applyToUsersTeam(61)
