const {
	editProfileInformation,
	registerSessionToken,
	verifySessionToken,
	verifyPlayerSignupInformation,
	verifyTeamSignupInformation,
	formatClientAccountInformation,
	dataPagination,
	verifyUserAuthorization,
	getPlayerGamingPerformance,
	updatePlayerGamingPerformance,
} = require("./apiUtils")
const {
	getAccountData,
	registerPlayerAccount,
	registerTeamAccount,
} = require("./endpointsUtils")
const {
	createTournament,
	advanceTeamInTournament,
	advanceTournamentRound,
	startTournament,
	joinTournament,
	getAllTournaments,
	getTournament,
} = require("./tournamentUtils")
const { AccountType, MININUM_NUMBER_OF_TEAMS_IN_TOURNAMENT } = require("../ServerUtils")
const { getTeamRecommendations } = require("../recommendation/main")

let globalTournamentId = -1

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient()

const server = express()
server.use(helmet())
server.use(express.json())
server.use(cors())

server.get("/teams/:teamId", async (req, res, next) => {
	try {
		const teamAccountData = await getAccountData(req.params.teamId, AccountType.TEAM)
		return res.status(200).json(teamAccountData)
	} catch (error) {
		next(error)
	}
})

server.get("/profiles/:profileId", async (req, res, next) => {
	try {
		const playerAccountData = await getAccountData(
			req.params.profileId,
			AccountType.PLAYER
		)
		return res.status(200).json(playerAccountData)
	} catch (error) {
		next(error)
	}
})

server.get("/collection/players", async (req, res, next) => {
	try {
		const pageData = await dataPagination(prisma, AccountType.PLAYER, req.query)
		return res.json(pageData)
	} catch (error) {
		next(error)
	}
})

server.get("/collection/teams", async (req, res, next) => {
	try {
		const pageData = await dataPagination(prisma, AccountType.TEAM, req.query)
		return res.json(pageData)
	} catch (error) {
		next(error)
	}
})

server.get("/api/login/", async (req, res, next) => {
	try {
		const email = req.query.email

		if (email == null) {
			res.status(404).json({ error: "Email not found in request query" })
			return
		}

		const accountData = await prisma.account.findUnique({ where: { email: email } })
		if (accountData == null) {
			res.status(404).json({ error: "Account not registered in database" })
			return
		}

		const jwtToken = await registerSessionToken(accountData)
		const clientAccountInformation = formatClientAccountInformation(
			accountData,
			jwtToken
		)
		return res.status(200).json(clientAccountInformation)
	} catch (error) {
		next(error)
	}
})

server.get("/account/applications/:accountId", async (req, res, next) => {
	try {
		const accountId = parseInt(req.params.accountId)
		const userApplications = await prisma.application.findMany({
			where: {
				OR: [{ playerAccountId: accountId }, { teamAccountId: accountId }],
			},
		})
		return res.status(200).json(userApplications)
	} catch (error) {
		next(error)
	}
})

server.get("/api/tournaments", async (req, res, next) => {
	try {
		const allTournaments = await getAllTournaments()
		if (allTournaments == null) {
			return res.status(400).json({ error: "Error while getting tournaments" })
		}
		return res.status(200).json(allTournaments)
	} catch (error) {
		next(error)
	}
})

server.get("/api/tournament/:tournamentId", async (req, res, next) => {
	try {
		const tournamentId = parseInt(req.params.tournamentId)
		const tournamentData = await getTournament(tournamentId)
		if (tournamentData == null) {
			return res.status(400).json({ error: "Error while getting tournament data" })
		}
		return res.status(200).json(tournamentData)
	} catch (error) {
		next(error)
	}
})

server.get("/api/team/recommendations/:playerAccountId", async (req, res, next) => {
	try {
		const playerData = await getAccountData(
			req.params.playerAccountId,
			AccountType.PLAYER
		)
		if (playerData == null) {
			return res.status(404).json({ error: "Player not found in database" })
		}

		const allTeamsInDatabase = await prisma.team.findMany()
		const teamRecommendations = getTeamRecommendations(playerData, allTeamsInDatabase)

		return res.status(200).json(teamRecommendations)
	} catch (error) {
		next(error)
	}
})

server.get("/tournaments/start/:tournamentId", async (req, res, next) => {
	try {
		const tournamentId = parseInt(req.params.tournamentId)
		const startedTournament = startTournament(tournamentId)
		if (startedTournament == null) {
			return res.status(400).json({ error: "Error while starting tournament" })
		}
		return res.status(200).json(startedTournament)
	} catch (error) {
		next(error)
	}
})

server.post("/api/tournaments/create", async (req, res, next) => {
	try {
		const teamAccountId = parseInt(req.body.accountId)
		const newTournament = await createTournament(
			teamAccountId,
			globalTournamentId,
			MININUM_NUMBER_OF_TEAMS_IN_TOURNAMENT
		)

		if (newTournament == null) {
			return res.status(400).json({ error: "Error while creating tournament" })
		}

		return res.status(200).json(newTournament)
	} catch (error) {
		next(error)
	}
})

server.post("/account/application", async (req, res, next) => {
	try {
		const playerApplicationToTeam = await prisma.application.findUnique({
			where: {
				playerAccountId_teamAccountId: {
					playerAccountId: req.body.playerAccountId,
					teamAccountId: req.body.teamAccountId,
				},
			},
		})

		if (playerApplicationToTeam != null) {
			res.status(400).json({
				error: "Cannot create application, player has already applied",
			})
			return
		}

		const createdApplication = await prisma.application.create({
			data: {
				playerAccountId: req.body.playerAccountId,
				teamAccountId: req.body.teamAccountId,
				status: req.body.status,
			},
		})

		return res.status(200).json(createdApplication)
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

		const createdAccount = await registerPlayerAccount(req.body)

		const jwtToken = await registerSessionToken(createdAccount)
		const clientAccountInformation = formatClientAccountInformation(
			createdAccount,
			jwtToken
		)

		const playerGamesJson = await getPlayerGamingPerformance(req.body.gameUsernames)
		await updatePlayerGamingPerformance(prisma, createdAccount.id, playerGamesJson)

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

		const createdAccount = await registerTeamAccount(req.body)

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

server.patch("/tournaments/team/advance/", async (req, res, next) => {
	try {
		const teamAccountId = parseInt(req.body.accountId)
		const tournamentId = parseInt(req.body.tournamentId)

		const updatedTournamentData = await advanceTeamInTournament(
			tournamentId,
			teamAccountId
		)
		if (updatedTournamentData == null) {
			return res
				.status(400)
				.json({ error: "Error while advancing team in tournament" })
		}

		const nextRoundTournament = await advanceTournamentRound(tournamentId)
		if (nextRoundTournament == null) {
			return res
				.status(400)
				.json({ error: "Error while advancing tournament round" })
		}

		return res.status(200).json(nextRoundTournament)
	} catch (error) {
		next(error)
	}
})

server.patch("/tournaments/join/", async (req, res, next) => {
	try {
		const teamAccountId = parseInt(req.body.teamAccountId)
		const tournamentId = parseInt(req.body.tournamentId)
		const joinedTournamentData = joinTournament(tournamentId, teamAccountId)
		if (joinedTournamentData == null) {
			return res.status(400).json({ error: "Error while starting tournament" })
		}
		return res.status(200).json(joinedTournamentData)
	} catch (error) {
		next(error)
	}
})

server.patch("/api/profiles/edit", async (req, res, next) => {
	const verifiedAuthorization = await verifyUserAuthorization(req.headers.authorization)

	if (!verifiedAuthorization) {
		res.status(401).json({ error: "Invalid authorization token" })
		return
	}
	if (req.body == null || req.body.accountId == null || req.body.accountType == null) {
		res.status(400).json({
			error: "Invalid request body: JSON payload is incomplete or malformed",
		})
		return
	}

	try {
		const updatedAccount = await editProfileInformation(
			prisma,
			verifiedAuthorization.id,
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

server.patch("/api/profiles/edit/account", async (req, res, next) => {
	const verifiedAuthorization = await verifyUserAuthorization(req.headers.authorization)
	const PAYLOAD_ERROR_MESSAGE =
		"Invalid request body: JSON payload is incomplete or malformed"

	if (!verifiedAuthorization) {
		return res.status(401).json({ error: "Invalid authorization token" })
	}

	try {
		const accountType = req.body.accountType
		const accountId = req.body.accountId
		let isRequestBodyComplete = false

		if (req.body == null || accountType == null || accountId == null) {
			return res.status(400).json({
				error: PAYLOAD_ERROR_MESSAGE,
			})
		}

		const modifiedRequestBody = req.body
		modifiedRequestBody.email = verifiedAuthorization.email

		if (modifiedRequestBody.accountType == AccountType.PLAYER) {
			isRequestBodyComplete = verifyPlayerSignupInformation(modifiedRequestBody)
		} else if (modifiedRequestBody.accountType == AccountType.TEAM) {
			isRequestBodyComplete = verifyTeamSignupInformation(modifiedRequestBody)
		}

		if (!isRequestBodyComplete) {
			return res.status(400).json({
				error: PAYLOAD_ERROR_MESSAGE,
			})
		}

		delete modifiedRequestBody.accountType
		delete modifiedRequestBody.accountId
		delete modifiedRequestBody.email
		delete modifiedRequestBody.teamName
		delete modifiedRequestBody.teamId

		const existingAccount = await prisma[accountType].findUnique({
			where: { accountId: accountId },
		})

		if (!existingAccount) {
			res.status(404).json({ error: "Account information not found in database" })
			return
		}

		if (accountType == AccountType.PLAYER) {
			const hasUsernameChanged =
				JSON.stringify(existingAccount.gameUsernames) !=
				JSON.stringify(modifiedRequestBody.gameUsernames)

			if (hasUsernameChanged) {
				for (const gameName of Object.keys(modifiedRequestBody.games)) {
					if (!modifiedRequestBody.gamingExperience.includes(gameName)) {
						delete modifiedRequestBody.games[gameName]
					}
				}
				const playerGamingPerformance = await getPlayerGamingPerformance(
					modifiedRequestBody.gameUsernames
				)
				modifiedRequestBody.games = playerGamingPerformance
			}
		}

		const updatedAccountInformation = await prisma[accountType].update({
			where: { accountId: accountId },
			data: modifiedRequestBody,
		})

		if (!updatedAccountInformation) {
			res.status(400).json({ error: "Invalid profile information, cannot update" })
			return
		}

		res.status(200).json({ updatedAccountInformation: updatedAccountInformation })
		return
	} catch (error) {
		next(error)
	}
})

server.use((err, res) => {
	const { message, status = 500 } = err
	res.status(status).json({ message })
})

async function initializeTournaments() {
	const tournamentsHolder = await prisma.tournaments.create({
		data: {
			tournamentIds: [],
		},
	})
	globalTournamentId = tournamentsHolder.id
}

initializeTournaments()

module.exports = server
