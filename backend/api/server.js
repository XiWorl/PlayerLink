const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient()

const server = express()
server.use(helmet())
server.use(express.json())
server.use(cors())


function checkSignupData(reqBody) {
    const isDataValid = (
		reqBody !== undefined &&
        reqBody.email !== undefined &&
		reqBody.firstName !== undefined &&
		reqBody.location !== undefined &&
		reqBody.willingToRelocate !== undefined &&
		reqBody.yearsOfExperience !== undefined
	)
	return isDataValid
}

server.get("/profiles", async (req, res, next) => {
	try {
		const data = await prisma.account.findMany()
		res.status(200).json(data)
		return
	} catch (err) {
		next(err)
		return
	}
})

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
                accountType: "player",
                email: req.body.email,
                player: {
                    create: {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        yearsOfExperience: req.body.yearsOfExperience,
                        location: req.body.location,
                        willingToRelocate: false
                    }
                }
            }
        })
        res.status(200).json(data)
        return

    } catch (err) {
		next(err)
		return
	}
})

module.exports = server
