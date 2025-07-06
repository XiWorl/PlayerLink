export const EditType = { ABOUT: "about", BIO: "bio", OVERVIEW: "overview" }

export async function editPlayerProfileInformation(prisma, accountId, body) {
	if (body.editType == null || body.value == null || EditType[body.editType] == null) {
		return false
	}

	const accountType = "player"
	const updatedPlayerData = await prisma[accountType].update({
		where: { accountId: accountId },
		data: {
			[EditType[body.editType]]: body.value,
		},
	})
	return updatedPlayerData
}
