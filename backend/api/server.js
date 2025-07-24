const {
	editPlayerProfileInformation,
	registerSessionToken,
	verifySessionToken,
	verifyPlayerSignupInformation,
	verifyTeamSignupInformation,
	formatClientAccountInformation,
	AccountType,
	dataPagination,
	updatePlayerGamingPerformance,
	getPlayerGamingPerformance,
	TOURNAMENT_NAME,
	getPlayerInfo,
} = require("./utils")
const { generateTournamentMatchups } = require("../tournamentScheduling/main")
const {
	createRoundsJson,
	MININUM_NUMBER_OF_TEAMS,
} = require("../tournamentScheduling/utils")
const { getFornitePlayerData } = require("../externalApi/main")
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { PrismaClient } = require("../generated/prisma")
const prisma = new PrismaClient()
let GLOBAL_TOURNAMENT_ID = -1

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

async function initializeTournaments() {
	const createdGlobalTournament = await prisma.tournaments.create({
		data: {
			tournamentIds: [],
		},
	})
	GLOBAL_TOURNAMENT_ID = createdGlobalTournament.id
	return GLOBAL_TOURNAMENT_ID
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

server.get("/tournaments/:tournamentId", async (req, res, next) => {
	try {
		const tournamentId = parseInt(req.params.tournamentId)
		const tournamentInformation = await prisma.tournament.findUnique({
			where: {
				tournamentId: tournamentId,
			},
		})
		return res.status(200).json(tournamentInformation)
	} catch (error) {
		next(error)
	}
})

server.get("/api/tournaments/", async (req, res, next) => {
	try {
		const tournaments = await prisma.tournament.findMany()
		return res.status(200).json(tournaments)
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

		const playerAccountData = await prisma.player.findUnique({
			where: { accountId: req.body.playerAccountId },
		})

		if (playerApplicationToTeam != null) {
			res.status(400).json({
				error: "Cannot create application, player has already applied",
			})
			return
		}
		if (playerAccountData.rosterAccountId != null) {
			return res.status(400).json({
				error: "Cannot create application, player is already on a team",
			})
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

		const createdAccount = await prisma.account.create({
			data: {
				accountType: AccountType.PLAYER,
				email: req.body.email,
				player: {
					create: {
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						yearsOfExperience: req.body.yearsOfExperience,
						playstyle: req.body.playstyle,
						gamingExperience: req.body.gamingExperience,
						games: {},
						gameUsernames: req.body.gameUsernames,
						location: req.body.location,
						willingToRelocate: convertToBoolean(req.body.willingToRelocate),
						rosterAccountIds: [],
					},
				},
			},
		})

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

		const createdAccount = await prisma.account.create({
			data: {
				accountType: AccountType.TEAM,
				email: req.body.email,
				team: {
					create: {
						name: req.body.teamName,
						location: req.body.location,
						desiredPlaystyle: req.body.desiredPlaystyle,
						desiredSkillLevel: req.body.desiredSkillLevel,
						supportedGames: req.body.supportedGames,
						currentlyHiring: convertToBoolean(req.body.currentlyHiring),
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

server.post("/api/tournaments/create", async (req, res, next) => {
	try {
		const roundsJson = createRoundsJson(MININUM_NUMBER_OF_TEAMS)

		const createdTournament = await prisma.tournament.create({
			data: {
				creatorAccountId: req.body.accountId,
				name: TOURNAMENT_NAME,
				rounds: roundsJson,
				minimumParticipants: MININUM_NUMBER_OF_TEAMS,
				allTournaments: {
					connect: { id: GLOBAL_TOURNAMENT_ID },
				},
				allParticipants: {},
				isActive: false,
				participantsAdvancedToNextRound: {},
			},
		})

		const tournamentId = createdTournament.tournamentId
		const updatedTournament = await prisma.tournament.update({
			where: { tournamentId: tournamentId },
			data: {
				allParticipants: {
					[req.body.accountId]: req.body,
				},
				name: TOURNAMENT_NAME + " " + tournamentId,
			},
		})

		await prisma.tournaments.update({
			where: { id: GLOBAL_TOURNAMENT_ID },
			data: {
				tournamentIds: {
					push: tournamentId,
				},
			},
		})

		return res.status(200).json(updatedTournament)
	} catch (error) {
		next(error)
	}
})

server.patch("/profiles/games/update", async (req, res, next) => {
	if (
		req.body == null ||
		req.body.accountId == null ||
		req.body.gameUsernames == null
	) {
		return res.status(400).json({ error: "Invalid request body" })
	}

	if (req.body.gameUsernames["Fortnite"] != null) {
		const fortnitePlayerData = await getFornitePlayerData(
			req.body.gameUsernames["Fortnite"]
		)
	}
})

server.patch("/applications/status/update", async (req, res, next) => {
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
		const playerApplicationToTeam = await prisma.application.findUnique({
			where: {
				playerAccountId_teamAccountId: {
					playerAccountId: req.body.playerAccountId,
					teamAccountId: req.body.teamAccountId,
				},
			},
		})
		//TODO: change this error code
		if (playerApplicationToTeam == null) {
			return res.status(400).json({
				error: "Cannot update application, application does not exist in database",
			})
		}
		if (playerApplicationToTeam.status != "pending") {
			return res.status(400).json({
				error: "Cannot update application, application has already been modified in the past",
			})
		}
		const updatedApplication = await prisma.application.update({
			where: {
				playerAccountId_teamAccountId: {
					playerAccountId: req.body.playerAccountId,
					teamAccountId: req.body.teamAccountId,
				},
			},
			data: {
				status: req.body.status,
			},
		})
		if (updatedApplication.status == "accepted") {
			const updatedPlayerData = await prisma.player.update({
				where: { accountId: req.body.playerAccountId },
				data: {
					rosterAccountIds: req.body.teamAccountId,
				},
			})
			const updatedTeamData = await prisma.team.update({
				where: { accountId: req.body.teamAccountId },
				data: {
					rosterAccountIds: {
						push: req.body.playerAccountId,
					},
				},
			})
		}
		return res.status(200).json(updatedApplication)
	} catch (error) {
		next(error)
	}
})

server.patch("/api/profiles/edit/account", async (req, res, next) => {
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
		if (req.body == null) {
			res.status(400).json({
				error: "Invalid request body: JSON payload is incomplete or malformed",
			})
			return
		}

		// req.body.willingToRelocate = convertToBoolean(req.body.willingToRelocate)
		// delete req.body.playerId
		// delete req.body.email
		// delete req.body.accountId
		const accountType = req.body.accountType
		const accountId = req.body.accountId
		delete req.body.accountType
		delete req.body.accountId

		const existingPlayer = await prisma[accountType].findUnique({
			where: { accountId: accountId },
		})

		if (!existingPlayer) {
			res.status(404).json({ error: "Player record not found for this account" })
			return
		}

		const updatedPlayerData = await prisma[accountType].update({
			where: { accountId: accountId },
			data: req.body,
		})

		if (!updatedPlayerData) {
			res.status(400).json({ error: "Invalid profile information, cannot update" })
			return
		}

		return res.status(200).json({ updatedValue: updatedPlayerData })
	} catch (error) {
		next(error)
	}
})

server.patch("/api/profiles/edit/profile", async (req, res, next) => {
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

//duplicate
server.get("/tournaments/start/:tournamentId", async (req, res, next) => {
	try {
		const tournamentId = parseInt(req.params.tournamentId)
		const tournamentInformation = await prisma.tournament.findUnique({
			where: {
				tournamentId: tournamentId,
			},
		})
		// if (tournamentInformation.isActive == true) {
		// 	return res.status(400).json({error: "Tournament is already active"})
		// }
		const startingMatchups = await generateTournamentMatchups(
			tournamentInformation.allParticipants
		)
		const updatedRounds = tournamentInformation.rounds
		updatedRounds["round1"] = startingMatchups

		const updatedTournament = await prisma.tournament.update({
			where: { tournamentId: tournamentId },
			data: {
				isActive: true,
				rounds: updatedRounds,
			},
		})

		return res.status(200).json(tournamentInformation)
	} catch (error) {
		next(error)
	}
})

server.patch("/tournaments/team/advance/", async (req, res, next) => {
	function getTotalNumberOfMatchupsBasedOnRound(roundNumber, numberOfParticipants) {
		const remainingTeamsInTournamentBasedOnRound =
			numberOfParticipants / Math.pow(2, roundNumber)
		return remainingTeamsInTournamentBasedOnRound
	}

	try {
		const tournamentId = parseInt(req.body.tournamentId)
		const accountId = parseInt(req.body.accountId)
		const tournamentInformation = await prisma.tournament.findUnique({
			where: {
				tournamentId: tournamentId,
			},
		})
		if (
			tournamentInformation.isActive == false ||
			!tournamentInformation.allParticipants[req.body.accountId]
		) {
			return res.status(400).json({ error: "Tournament is not active" })
		}

		if (tournamentInformation.participantsAdvancedToNextRound[accountId]) {
			return res.status(400).json({ error: "Team has already advanced" })
		}



		const teamData = await prisma.team.findUnique({
			where: { accountId: accountId },
		})

		teamData.advancedAt = Date.now()

		const updatedTournament = await prisma.tournament.update({
			where: { tournamentId: tournamentId },
			data: {
				participantsAdvancedToNextRound: {
					...tournamentInformation.participantsAdvancedToNextRound,
					[req.body.accountId]: teamData,
				},
			},
		})

		const currentRound = tournamentInformation.currentRound
		const num = getTotalNumberOfMatchupsBasedOnRound(
			currentRound,
			Object.keys(tournamentInformation.allParticipants).length
		)
		if (num == 1) { return res.status(200).json(updatedTournament) }


		if (
			Object.keys(updatedTournament.participantsAdvancedToNextRound).length >=
			num
		) {
			const nextRound = currentRound + 1

			const updatedTournament2 = await prisma.tournament.update({
				where: { tournamentId: tournamentId },
				data: {
					currentRound: nextRound,
					rounds: {
						...updatedTournament.rounds,
						["round" + nextRound]: [
							updatedTournament.participantsAdvancedToNextRound,
						],
					},
					// participantsAdvancedToNextRound: {
					// 	...tournamentInformation.participantsAdvancedToNextRound,
					// 	[req.body.accountId]: teamData,
					// },
				},
			})
			const firstElement = Object.values(
				updatedTournament2.rounds["round" + nextRound]
			)[0]
			const matchups = await generateTournamentMatchups(firstElement)

			const updatedTournament3 = await prisma.tournament.update({
				where: { tournamentId: tournamentId },
				data: {
					currentRound: nextRound,
					rounds: {
						...updatedTournament2.rounds,
						["round" + nextRound]: matchups,
					},
					participantsAdvancedToNextRound: {},
				},
			})
			return res.status(200).json(updatedTournament3)
		}

		return res.status(200).json(updatedTournament)
	} catch (error) {
		next(error)
	}
})

server.use((err, res) => {
	const { message, status = 500 } = err
	res.status(status).json({ message })
})

server.createTournament = async function (body) {
	try {
		const roundsJson = createRoundsJson(MININUM_NUMBER_OF_TEAMS)

		const createdTournament = await prisma.tournament.create({
			data: {
				creatorAccountId: body.accountId,
				name: TOURNAMENT_NAME,
				rounds: roundsJson,
				minimumParticipants: MININUM_NUMBER_OF_TEAMS,
				isActive: false,
				participantsAdvancedToNextRound: {},
				allTournaments: {
					connect: { id: GLOBAL_TOURNAMENT_ID },
				},
				allParticipants: {},
			},
		})

		const tournamentId = createdTournament.tournamentId
		const updatedTournament = await prisma.tournament.update({
			where: { tournamentId: tournamentId },
			data: {
				allParticipants: {
					[body.accountId]: body,
				},
				name: TOURNAMENT_NAME + " " + tournamentId,
			},
		})

		await prisma.tournaments.update({
			where: { id: GLOBAL_TOURNAMENT_ID },
			data: {
				tournamentIds: {
					push: tournamentId,
				},
			},
		})
		return updatedTournament
	} catch (error) {
	}
}

server.getPlayerData = async function (accountId) {
	return await getPlayerInfo(prisma, accountId)
}

initializeTournaments()

module.exports = server
