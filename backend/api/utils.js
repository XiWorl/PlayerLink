import jwt from "jsonwebtoken"
import {
	getFortnitePlayerData,
	getApexPlayerData,
	getValorantPlayerData,
} from "../externalApi/main.js"
export const EditType = { ABOUT: "about", BIO: "bio", OVERVIEW: "overview" }
export const AccountType = { PLAYER: "player", TEAM: "team" }
export const TOURNAMENT_NAME = "Tournament"
export let GLOBAL_TOURNAMENT_ID = { id: -1 }
import dotenv from "dotenv"

dotenv.config()
const TOKEN_SECRET = process.env.TOKEN_SECRET
const PAGE_SIZE = 10

export function verifyPlayerSignupInformation(requestBody) {
	const isDataValid =
		requestBody !== undefined &&
		requestBody.email !== undefined &&
		requestBody.firstName !== undefined &&
		requestBody.location !== undefined &&
		requestBody.willingToRelocate !== undefined &&
		requestBody.yearsOfExperience !== undefined
	return isDataValid
}

export function verifyTeamSignupInformation(requestBody) {
	// const isDataValid =
	// 	requestBody !== undefined &&
	// 	requestBody.email !== undefined &&
	// 	requestBody.teamName !== undefined &&
	// 	requestBody.location !== undefined &&
	// 	requestBody.yearEstablished !== undefined &&
	// 	requestBody.hiring !== undefined
	// return isDataValid
	return true
}

export function formatClientAccountInformation(accountInformation, jwtToken) {
	const clientResponseInformation = {
		id: accountInformation.id,
		accountType: accountInformation.accountType,
		token: jwtToken,
	}
	return clientResponseInformation
}

export async function editPlayerProfileInformation(prisma, loggedInUserId, body) {
	if (body.editType == null || body.value == null || EditType[body.editType] == null) {
		return false
	}
	if (body.accountId == null || loggedInUserId != body.accountId) {
		return false
	}

	const accountType = "player"
	const sectionOfProfileToEdit = EditType[body.editType]
	const updatedPlayerData = await prisma[accountType].update({
		where: { accountId: loggedInUserId },
		data: {
			[sectionOfProfileToEdit]: body.value,
		},
	})
	return updatedPlayerData[sectionOfProfileToEdit]
}

export async function registerSessionToken(accountInformation) {
	const token = jwt.sign(accountInformation, TOKEN_SECRET)
	return token
}

export async function verifySessionToken(token) {
	try {
		const decoded = jwt.verify(token, TOKEN_SECRET)
		return decoded
	} catch (err) {
		return null
	}
}

export async function dataPagination(prisma, accountType, query) {
	const initialPage = 1
	let page = initialPage
	if (query != null && query.page != null && !isNaN(parseInt(query.page))) {
		page = parseInt(query.page)
	}

	const accountsInPage = await prisma[accountType].findMany({
		skip: (page - 1) * PAGE_SIZE,
		take: PAGE_SIZE,
	})

	const totalPages = Math.ceil((await prisma[accountType].count()) / PAGE_SIZE)
	return {
		data: accountsInPage,
		totalPages: totalPages,
		currentPage: page,
	}
}

export async function getPlayerGamingPerformance(gameUsernames) {
	let gamePerformance = {}

	if (gameUsernames["Fortnite"] != null) {
		console.log("in c1")
		const fortnitePlayerData = await getFortnitePlayerData(gameUsernames["Fortnite"])
		if (fortnitePlayerData != null) {
			gamePerformance["Fortnite"] = fortnitePlayerData
		}
		console.log("past c1")
	}

	if (gameUsernames["Apex Legends"] != null) {
		const apexPlayerData = await getApexPlayerData(gameUsernames["Apex Legends"])
		if (apexPlayerData != null) {
			gamePerformance["Apex Legends"] = apexPlayerData
		}
	}

	if (gameUsernames["Valorant"] != null) {
		if (gameUsernames["Valorant"].indexOf("#") != -1) {
			const splitUsername = gameUsernames["Valorant"].split("#")
			const username = splitUsername[0]
			const tagline = splitUsername[1]
			const valorantPlayerData = await getValorantPlayerData(username, tagline)
			gamePerformance["Valorant"] = valorantPlayerData
		}
	}
	return gamePerformance
}

export async function updatePlayerGamingPerformance(prisma, accountId, gamePerformance) {
	const updatedPlayerData = await prisma[AccountType.PLAYER].update({
		where: { accountId: accountId },
		data: {
			games: gamePerformance,
		},
	})
	return updatedPlayerData
}

export async function joinTournament(prisma, accountId, tournamentId, participantData) {
	const tournament = await prisma.tournament.findUnique({
		where: { tournamentId: tournamentId },
	})

	if (tournament == null) {
		return null
	}
	if (Object.keys(tournament.allParticipants).length >= tournament.minimumParticipants) {
		return null
	}
	const updatedParticipantsObject = tournament.allParticipants
	updatedParticipantsObject[accountId] = participantData

	const updatedTourmanent = await prisma.tournament.update({
		where: { tournamentId: tournamentId },
		data: {
			allParticipants: updatedParticipantsObject,
		},
	})

	return updatedTourmanent

}
