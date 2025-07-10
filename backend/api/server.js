const {
	editPlayerProfileInformation,
	registerSessionToken,
	verifySessionToken,
	verifyPlayerSignupInformation,
	verifyTeamSignupInformation,
	formatClientAccountInformation,
	AccountType,
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

server.get("/teams/:teamId", async (req, res, next) => {
	try {
		const teamId = parseInt(req.params.teamId)
		const teamData = await prisma.team.findUnique({ where: { accountId: teamId } })
		return res.status(200).json(teamData)
	} catch (error) {
		next(error)
	}
})

server.get("/profiles/:profileId", async (req, res, next) => {
	try {
		const playerId = parseInt(req.params.profileId)
		const playerData = await prisma.player.findUnique({
			where: { accountId: playerId },
		})
		return res.status(200).json(playerData)
	} catch (error) {
		next(error)
	}
})

server.get("/api/login/", async (req, res, next) => {
	try {
		const email = req.query.email

		if (email == null) {
			res.status(404).json({ error: "Account not found" })
			return
		}

		const accountData = await prisma.account.findUnique({ where: { email: email } })
		if (accountData == null) {
			res.status(404).json({ error: "Account not found" })
			return
		}

		const token = await registerSessionToken(accountData)
		const clientResponseInformation = {
			id: accountData.id,
			accountType: accountData.accountType,
			token: token,
		}
		return res.status(200).json(clientResponseInformation)
	} catch (error) {
		next(error)
	}
})

server.post("/api/signup/player", async (req, res, next) => {
	try {
		if (verifyPlayerSignupInformation(req.body) == false) {
			res.status(400).json({
				error: "Invalid request body: JSON payload is incomplete or malformed",
			})
			return
		}

		const createdAccount = await prisma.account.create({
			data: {
				accountType: AccountType.PLAYER,
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

		const jwtToken = await registerSessionToken(createdAccount)
		const clientAccountInformation = formatClientAccountInformation(
			createdAccount,
			jwtToken
		)

		return res.status(200).json(clientAccountInformation)
	} catch (error) {
		next(error)
	}
})

server.post("/api/signup/team", async (req, res, next) => {
	try {
		if (verifyTeamSignupInformation(req.body) == false) {
			res.status(400).json({
				error: "Invalid request body: JSON payload is incomplete or malformed",
			})
			return
		}

		const createdAccount = await prisma.account.create({
			data: {
				accountType: AccountType.TEAM,
				email: req.body.email,
				team: {
					create: {
						name: req.body.teamName,
						yearEstablished: req.body.yearEstablished,
						location: req.body.location,
						currentlyHiring: convertToBoolean(req.body.hiring),
					},
				},
			},
		})

		const jwtToken = await registerSessionToken(createdAccount)
		const clientAccountInformation = formatClientAccountInformation(
			createdAccount,
			jwtToken
		)

		return res.status(200).json(clientAccountInformation)
	} catch (error) {
		next(error)
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
			res.status(400).json({
				error: "Invalid request body: JSON payload is incomplete or malformed",
			})
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

		return res.status(200).json({ updatedValue: updatedAccount })
	} catch (error) {
		next(error)
	}
})

server.use((err, res) => {
	const { message, status = 500 } = err
	res.status(status).json({ message })
})

module.exports = server
