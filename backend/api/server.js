const {
	editPlayerProfileInformation,
	registerSessionToken,
	verifySessionToken,
	dataPagination,
	getVerifiedAccountInformation,
} = require("./utils")
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { PrismaClient, AccountType } = require("../generated/prisma")
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

//TODO: This GET request is only used for testing purposes. Remove this before production.
server.get("/players", async (req, res, next) => {
	try {
		const data = await prisma.player.findMany()
		res.status(200).json(data)
		return
	} catch (err) {
		next(err)
		return
	}
})

//TODO: This GET request is only used for testing purposes. Remove this before production.
server.get("/teams", async (req, res, next) => {
	try {
		const data = await prisma.team.findMany()
		res.status(200).json(data)
		return
	} catch (err) {
		next(err)
		return
	}
})

server.get("/collection/players", async (req, res, next) => {
	try {
		const pageData = await dataPagination(prisma, AccountType.player, req.query)
		res.json(pageData)
	} catch (err) {
		next(err)
		return
	}
})
server.get("/collection/teams", async (req, res, next) => {
	try {
		const pageData = await dataPagination(prisma, AccountType.team, req.query)
		res.json(pageData)
	} catch (err) {
		next(err)
		return
	}
})

server.get("/teams/:teamId", async (req, res, next) => {
	try {
		const id = parseInt(req.params.teamId)
		const data = await prisma.team.findUnique({ where: { accountId: id } })
		res.status(200).json(data)
		return
	} catch (err) {
		next(err)
		return
	}
})

server.get("/profiles/:profileId", async (req, res, next) => {
	try {
		const id = parseInt(req.params.profileId)
		const data = await prisma.player.findUnique({ where: { accountId: id } })
		res.status(200).json(data)
		return
	} catch (err) {
		next(err)
		return
	}
})

server.get("/api/login/", async (req, res, next) => {
	try {
		const email = req.query.email

		if (email == null) {
			res.status(404).json({ error: "Account not found" })
			return
		}

		const data = await prisma.account.findUnique({ where: { email: email } })
		if (data == null) {
			res.status(404).json({ error: "Account not found" })
			return
		}

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

server.get("/api/verify/token", async (req, res, next) => {
	const authorizationHeader = req.headers.authorization
	const token = authorizationHeader.replace("Bearer ", "")
	const verification = await getVerifiedAccountInformation(prisma, token)
	if (!verification) {
		res.status(401).json({ error: "Invalid authorization token" })
		return
	}
	res.status(200).json(verification)
	return
})

server.get("/account/applications/:accountId", async (req, res, next) => {
	try {
		const id = parseInt(req.params.accountId)
		const data = await prisma.application.findMany({
			where: {
				OR: [{ playerAccountId: id }, { teamAccountId: id }],
			},
		})
		console.log(data)
		res.status(200).json(data)
		return
	} catch (err) {
		next(err)
		return
	}
})

server.post("/account/application", async (req, res, next) => {
	try {
		const data = await prisma.application.create({
			data: {
				playerAccountId: req.body.playerAccountId,
				teamAccountId: req.body.teamAccountId,
				status: req.body.status,
			},
		})
		res.status(200).json(data)
		return
	} catch (err) {
		next(err)
		return
	}
})

server.post("/api/signup/player", async (req, res, next) => {
	try {
		if (checkSignupData(req.body) == false) {
			res.status(400).json({ error: "Invalid signup data" })
			return
		}
		const data = await prisma.account.create({
			data: {
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

server.post("/api/signup/team", async (req, res, next) => {
	try {
		const data = await prisma.account.create({
			data: {
				accountType: "team",
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
	const authorization = await verifySessionToken(token)

	if (authorization == null || !authorization || !authorization.id) {
		res.status(401).json({ error: "Invalid authorization token" })
		return
	}

	try {
		if (req.body == null || req.body.accountId == null) {
			res.status(400).json({ error: "Must provide valid body information" })
			return
		}

		const result = await editPlayerProfileInformation(
			prisma,
			authorization.id,
			req.body
		)
		if (!result) {
			res.status(400).json({ error: "Invalid profile information, cannot update" })
			return
		}

		res.status(200).json({ updatedValue: result })
		return
	} catch (err) {
		next(err)
		return
	}
})

module.exports = server
