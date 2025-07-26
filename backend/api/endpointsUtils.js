const { PrismaClient } = require("../generated/prisma")
const {
	AccountType,
	convertYesOrNoToBoolean,
	DEFAULT_RECOMMENDATION_STATISTICS,
} = require("../ServerUtils")
const prisma = new PrismaClient()

async function getAccountData(accountId, accountType) {
	try {
		const verifiedAccountId = parseInt(accountId)

		if (isNaN(verifiedAccountId)) {
			throw new Error("Invalid account id")
		}

		const accountData = await prisma[accountType].findUnique({
			where: { accountId: verifiedAccountId },
		})
		return accountData
	} catch (error) {
		return error
	}
}

async function updateAccount(accountId, accountType, data) {
	const updateAccount = await prisma[accountType].update({
		where: { id: accountId },
		data: data,
	})
	return updateAccount
}

async function registerPlayerAccount(requestBody) {
	const createdAccount = await prisma.account.create({
		data: {
			accountType: AccountType.PLAYER,
			email: requestBody.email,
			player: {
				create: {
					firstName: requestBody.firstName,
					lastName: requestBody.lastName,
					yearsOfExperience: requestBody.yearsOfExperience,
					location: requestBody.location,
					playstyle: requestBody.playstyle,
					gamingExperience: requestBody.gamingExperience,
					gameUsernames: requestBody.gameUsernames,
					games: {},
					rosterAccountIds: [],
					recommendationStatistics: DEFAULT_RECOMMENDATION_STATISTICS,
					willingToRelocate: convertYesOrNoToBoolean(
						requestBody.willingToRelocate
					),
				},
			},
		},
	})
	return createdAccount
}

async function registerTeamAccount(requestBody) {
	const createdAccount = await prisma.account.create({
		data: {
			accountType: AccountType.TEAM,
			email: requestBody.email,
			team: {
				create: {
					name: requestBody.teamName,
					location: requestBody.location,
					desiredPlaystyle: requestBody.desiredPlaystyle,
					desiredSkillLevel: requestBody.desiredSkillLevel,
					supportedGames: requestBody.supportedGames,
					currentlyHiring: convertYesOrNoToBoolean(requestBody.currentlyHiring),
					recommendationHistory: {
						interactions: {},
					},
				},
			},
		},
	})
	return createdAccount
}

module.exports = {
	getAccountData,
	registerPlayerAccount,
	registerTeamAccount,
	updateAccount,
}
