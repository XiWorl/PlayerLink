import jwt from "jsonwebtoken"
import {
	getFortnitePlayerData,
	getApexPlayerData,
	getValorantPlayerData,
} from "../externalApi/main.js"
import { LOCATION_OPTIONS, SkillLevelOptions, PlaystyleOptions } from "../ServerUtils.js"
export const EditType = { ABOUT: "about", BIO: "bio", OVERVIEW: "overview" }
export const AccountType = { PLAYER: "player", TEAM: "team" }
export const TOURNAMENT_NAME = "Tournament"
export let GLOBAL_TOURNAMENT_ID = { id: -1 }
import dotenv from "dotenv"

dotenv.config()
const TOKEN_SECRET = process.env.TOKEN_SECRET
const PAGE_SIZE = 10
const INITIAL_WEIGHT_VALUE = 0.5

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
		const fortnitePlayerData = await getFortnitePlayerData(gameUsernames["Fortnite"])
		if (fortnitePlayerData != null) {
			gamePerformance["Fortnite"] = fortnitePlayerData
		}
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
	if (
		Object.keys(tournament.allParticipants).length >= tournament.minimumParticipants
	) {
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

export async function getPlayerInfo(prisma, accountId) {
	const playerData = await prisma.player.findUnique({
		where: { accountId: accountId },
	})
	return playerData
}

export const DEFAULT_RECOMMENDATION_STATISTICS = {
	favorabilityWeights: {
		locations: {
			[LOCATION_OPTIONS.USA]: INITIAL_WEIGHT_VALUE,
			[LOCATION_OPTIONS.SOUTH_AMERICA]: INITIAL_WEIGHT_VALUE,
			[LOCATION_OPTIONS.EUROPE]: INITIAL_WEIGHT_VALUE,
			[LOCATION_OPTIONS.ASIA]: INITIAL_WEIGHT_VALUE,
			[LOCATION_OPTIONS.OCEANIA]: INITIAL_WEIGHT_VALUE,
			[LOCATION_OPTIONS.AFRICA]: INITIAL_WEIGHT_VALUE,
			[LOCATION_OPTIONS.CANADA]: INITIAL_WEIGHT_VALUE,
			[LOCATION_OPTIONS.MEXICO]: INITIAL_WEIGHT_VALUE,
		},
		skillLevels: {
			[SkillLevelOptions.SEMI_PRO]: INITIAL_WEIGHT_VALUE,
			[SkillLevelOptions.PRO]: INITIAL_WEIGHT_VALUE,
			[SkillLevelOptions.ELITE]: INITIAL_WEIGHT_VALUE,
		},
		playstyle: {
			[PlaystyleOptions.AGGRESSIVE]: INITIAL_WEIGHT_VALUE,
			[PlaystyleOptions.DEFENSIVE]: INITIAL_WEIGHT_VALUE,
			[PlaystyleOptions.ADAPTIVE]: INITIAL_WEIGHT_VALUE,
			[PlaystyleOptions.SUPPORTIVE]: INITIAL_WEIGHT_VALUE,
			[PlaystyleOptions.TACTICAL]: INITIAL_WEIGHT_VALUE,
			[PlaystyleOptions.BALANCED]: INITIAL_WEIGHT_VALUE,
		},
	},
}
