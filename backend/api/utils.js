import jwt from "jsonwebtoken"
export const EditType = { ABOUT: "about", BIO: "bio", OVERVIEW: "overview" }
import dotenv from "dotenv"

dotenv.config()
const TOKEN_SECRET = process.env.TOKEN_SECRET

export async function editPlayerProfileInformation(prisma, accountId, body) {
	try {
		//TODO: Currently the accountType is hardcoded to player. In a future commit, this will be changed to be dynamic based on the accountType.
		const accountType = "player"
		await prisma[accountType].update({
			where: { accountId: accountId },
			data: {
				[EditType[body.editType]]: body.value,
			},
		})
		return true
	} catch (_err) {
		return false
	}
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
		return false
	}
}
