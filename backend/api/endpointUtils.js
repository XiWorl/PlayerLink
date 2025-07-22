const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient()

async function getPlayerData(accountId) {
	const playerData = await prisma.player.findUnique({
		where: { accountId: accountId },
	})
	return playerData
}

module.exports = {
	getPlayerData,
}
