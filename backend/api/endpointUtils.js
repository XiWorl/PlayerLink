const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient()

async function getPlayerData(accountId) {
	const playerData = await prisma.player.findUnique({
		where: { accountId: accountId },
	})
	return playerData
}

async function getTeamData(accountId) {
	const teamData = await prisma.team.findUnique({
		where: { accountId: accountId },
	})
	return teamData
}

async function updateAccount(accountId, accountType, data) {
	const updateAccount = await prisma[accountType].update({
		where: { id: accountId },
		data: data,
	})
	return updateAccount
}

module.exports = {
	getPlayerData,
	getTeamData,
	updateAccount
}
