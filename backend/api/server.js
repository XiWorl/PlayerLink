const {
	editPlayerProfileInformation,
	registerSessionToken,
	verifySessionToken,
} = require("./utils")
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient()

const server = express()
server.use(helmet())
server.use(express.json())
server.use(cors())

function convertToBoolean(value) {
	const YES_VALUE = "yes"
	if (value.toLowerCase() == YES_VALUE) {
		return true
	} else return false
}

function checkSignupData(reqBody) {
	const isDataValid =
		reqBody !== undefined &&
		reqBody.email !== undefined &&
		reqBody.firstName !== undefined &&
		reqBody.location !== undefined &&
		reqBody.willingToRelocate !== undefined &&
		reqBody.yearsOfExperience !== undefined
	return isDataValid
}

server.get("/teams/:teamId", async (req, res, next) => {
	try {
		const teamId = parseInt(req.params.teamId)
		const teamData = await prisma.team.findUnique({ where: { accountId: teamId } })
		return res.status(200).json(teamData)
	} catch (err) {
		next(err)
	}
})

server.get("/profiles/:profileId", async (req, res, next) => {
	try {
		const playerId = parseInt(req.params.profileId)
		const playerData = await prisma.player.findUnique({
			where: { accountId: playerId },
		})
		return res.status(200).json(playerData)
	} catch (err) {
		next(err)
	}
})

server.get("/api/login/", async (req, res, next) => {
	try {
		const email = req.query.email

		if (email == null) {
			res.status(404).json({ error: "Account not found" })
			return
		}

		const acoountData = await prisma.account.findUnique({ where: { email: email } })
		if (acoountData == null) {
			res.status(404).json({ error: "Account not found" })
			return
		}

		const token = await registerSessionToken(acoountData)
		const clientResponseInformation = {
			id: acoountData.id,
			accountType: acoountData.accountType,
			token: token,
		}
		return res.status(200).json(clientResponseInformation)
	} catch (err) {
		next(err)
	}
})

server.post("/api/signup/", async (req, res, next) => {
	try {
		if (checkSignupData(req.body) == false) {
			res.status(400).json({ error: "Invalid signup data" })
			return
		}
		const data = await prisma.account.create({
			data: {
				// TODO: Currently the account type is hardcoded to player. In the future, account type can either be "player" or "team". This change will be made after the team profile page is complete.
				accountType: "player",
				email: req.body.email,
				player: {
					create: {
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						yearsOfExperience: req.body.yearsOfExperience,
						location: req.body.location,
						willingToRelocate: convertToBoolean(req.body.willingToRelocate),
					},
				},
			},
		})

		const token = await registerSessionToken(data)
		const clientResponseInformation = {
			id: data.id,
			accountType: data.accountType,
			token: token,
		}

		res.status(200).json(clientResponseInformation)
		return
	} catch (err) {
		next(err)
		return
	}
})

server.patch("/api/profiles/edit", async (req, res, next) => {
	const authorizationHeader = req.headers.authorization
	const token = authorizationHeader.replace("Bearer ", "")
	const verifiedAuthorization = await verifySessionToken(token)

	if (
		verifiedAuthorization == null ||
		!verifiedAuthorization ||
		!verifiedAuthorization.id
	) {
		res.status(401).json({ error: "Invalid authorization token" })
		return
	}

	try {
		if (req.body == null || req.body.accountId == null) {
			res.status(400).json({ error: "Must provide valid body information" })
			return
		}

		const updatedAccount = await editPlayerProfileInformation(
			prisma,
			authorization.id,
			req.body
		)
		if (!updatedAccount) {
			res.status(400).json({ error: "Invalid profile information, cannot update" })
			return
		}

		res.status(200).json({ updatedValue: updatedAccount })
		return
	} catch (err) {
		next(err)
		return
	}
})

module.exports = server
