import jwt from "jsonwebtoken"
import { GameOptions } from "../ServerUtils.js"
import {
	getFortniteAccountData,
	getApexAccountData,
	getValorantAccountData,
} from "../externalApi/main.js"
export const EditType = {
	ABOUT: "about",
	BIO: "bio",
	OVERVIEW: "overview",
	DESCRIPTION: "description",
}
import dotenv from "dotenv"

dotenv.config()
const VALORANT_TAGLINE_SEPARATOR = "#"
const TOKEN_SECRET = process.env.TOKEN_SECRET
const PAGE_SIZE = 10
const START_PAGE = 1

export function verifyPlayerSignupInformation(requestBody) {
	const isDataValid =
		requestBody !== undefined &&
		requestBody.email !== undefined &&
		requestBody.firstName !== undefined &&
		requestBody.location !== undefined &&
		requestBody.willingToRelocate !== undefined &&
		requestBody.yearsOfExperience !== undefined &&
		requestBody.playstyle !== undefined &&
		requestBody.gameUsernames !== undefined &&
		requestBody.gamingExperience !== undefined
	return isDataValid
}

export function verifyTeamSignupInformation(requestBody) {
	const isDataValid =
		requestBody !== undefined &&
		requestBody.email !== undefined &&
		requestBody.teamName !== undefined &&
		requestBody.location !== undefined &&
		requestBody.currentlyHiring !== undefined &&
		requestBody.desiredPlaystyle !== undefined &&
		requestBody.desiredSkillLevel !== undefined &&
		requestBody.supportedGames !== undefined
	return isDataValid
}

export function formatClientAccountInformation(accountInformation, jwtToken) {
	const clientResponseInformation = {
		id: accountInformation.id,
		accountType: accountInformation.accountType,
		token: jwtToken,
	}
	return clientResponseInformation
}

export async function editProfileInformation(prisma, loggedInUserId, body) {
	if (body.editType == null || body.value == null || EditType[body.editType] == null) {
		return null
	}
	if (body.accountId == null || loggedInUserId != body.accountId || !body.accountType) {
		return null
	}

	const sectionOfProfileToEdit = EditType[body.editType]
	const updatedPlayerData = await prisma[body.accountType].update({
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

export async function verifyUserAuthorization(authorizationHeader) {
	const token = authorizationHeader.replace("Bearer ", "")
	const verifiedAuthorization = await verifySessionToken(token)

	if (
		verifiedAuthorization == null ||
		!verifiedAuthorization ||
		!verifiedAuthorization.id
	) {
		return null
	}
	return verifiedAuthorization
}

export async function dataPagination(prisma, accountType, query) {
	let page = START_PAGE
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

	if (gameUsernames[GameOptions.FORTNITE] != null) {
		const fortniteAccountData = await getFortniteAccountData(
			gameUsernames[GameOptions.FORTNITE]
		)
		if (fortniteAccountData != null) {
			gamePerformance[GameOptions.FORTNITE] = fortniteAccountData
		}
	}

	if (gameUsernames[GameOptions.APEX_LEGENDS] != null) {
		const apexAccountData = await getApexAccountData(
			gameUsernames[GameOptions.APEX_LEGENDS]
		)
		if (apexAccountData != null) {
			gamePerformance[GameOptions.APEX_LEGENDS] = apexAccountData
		}
	}

	if (gameUsernames[GameOptions.VALORANT] != null) {
		if (
			gameUsernames[GameOptions.VALORANT].indexOf(VALORANT_TAGLINE_SEPARATOR) != -1
		) {
			const splitUsername = gameUsernames[GameOptions.VALORANT].split(
				VALORANT_TAGLINE_SEPARATOR
			)
			const username = splitUsername[0]
			const tagline = splitUsername[1]

			const valorantAccountData = await getValorantAccountData(username, tagline)
			gamePerformance[GameOptions.VALORANT] = valorantAccountData
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
