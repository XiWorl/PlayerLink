const { editPlayerProfileInformation } = require("./utils")
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

		res.status(200).json(data)
		return
	} catch (err) {
		next(err)
		return
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
		res.status(200).json(data)
		return
	} catch (err) {
		next(err)
		return
	}
})

server.patch("/api/profiles/edit", async (req, res, next) => {
	try {
		if (req.body == null) {
			res.status(400).json({ error: "Must provide body information" })
			return
		}

		const result = editPlayerProfileInformation(prisma, 2, req.body)
		if (!result) {
			res.status(400).json({ error: "Invalid profile information, cannot update" })
			return
		}

		res.status(200).json({ message: "Successfully updated profile" })
		return
	} catch (err) {
		next(err)
		return
	}
})

module.exports = server
