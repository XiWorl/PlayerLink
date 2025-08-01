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

async function populateTournamentWithTeams(tournamentId) {
    const allTeams = await prisma.teams.findMany()
    console.log(allTeams)
}
