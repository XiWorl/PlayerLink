import { PrismaClient } from "../generated/prisma/index.js"
const prisma = new PrismaClient()
import { createTournament, joinTournament } from "../api/tournamentUtils.js"

const YearsOfExperienceOptions = Object.freeze({
	ZERO_TO_ONE: "0-1",
	TWO_TO_THREE: "2-3",
	FOUR_TO_FIVE: "4-5",
	SIX_TO_TEN: "6-10",
	TENPLUS: "10+",
})

const GameOptions = {
	APEX_LEGENDS: "Apex Legends",
	FORTNITE: "Fortnite",
	VALORANT: "Valorant",
}
const SkillLevelOptions = {
	SEMI_PRO: "Semi-Pro",
	PRO: "Pro",
	ELITE: "Elite",
}
const PlaystyleOptions = {
	AGGRESSIVE: "Aggressive",
	DEFENSIVE: "Defensive",
	ADAPTABLE: "Adaptable",
	TACTICAL: "Tactical",
	BALANCED: "Balanced",
	SUPPORTIVE: "Supportive",
}

function selectFromList(listOptions) {
	const newList = []
	for (let option of listOptions) {
		if (Math.random() < 0.5) {
			newList.push(option)
		}
	}
	return newList
}

function createName() {
	const prefix = [
		"Cloud",
		"Apex",
		"Surge",
		"Energy",
		"Nova",
		"Millenium",
		"Turismo",
		"Sigma",
		"Star",
	]
	const suffix = ["Gaming", "Elites", "Esports", "Clan", "Champions"]
	const preMadeNames = [
		"Unlimited Range Gaming",
		"Team Flames",
		"Team Secret",
		"Team Liquid",
		"Team Envy",
		"Heroic",
		"Team Lazarus",
		"Tencent Gaming",
		"Limitless Crew",
		"Headtop",
		"Rogue",
		"Team Vitality",
		"Ghost Gaming",
		"MV United Esports",
		"Team ROX",
	]
	if (Math.random() < 0.5) {
		return preMadeNames[Math.floor(Math.random() * preMadeNames.length)]
	} else {
		return (
			prefix[Math.floor(Math.random() * prefix.length)] +
			" " +
			suffix[Math.floor(Math.random() * suffix.length)]
		)
	}
}

function generateRandomTeamInfo(index) {
	const gameOptions = Object.values(GameOptions)
	const skillLevelOptions = Object.values(SkillLevelOptions)
	const playstyleOptions = Object.values(PlaystyleOptions)
	return {
		name: createName(),
		location: ["USA", "Europe", "Asia"][Math.floor(Math.random() * 3)],
		rosterAccountIds: [],
		description: [
			"FPS focused e-sports Team",
			"Championship focused e-sports Team",
			"Strategy focused e-sports Team",
		][Math.floor(Math.random() * 3)],
		overview: [
			"We are a team of FPS players looking to expand our reach and grow our community.",
			"We are a team of esports players looking to expand our reach and grow our community.",
			"We are a team of Strategy players looking to expand our reach and grow our community.",
		][Math.floor(Math.random() * 3)],
		currentlyHiring: Math.random() < 0.5,
		supportedGames: selectFromList(gameOptions),
		desiredSkillLevel:
			skillLevelOptions[Math.floor(Math.random() * skillLevelOptions.length)],
		desiredPlaystyle: selectFromList(playstyleOptions),
		recommendationHistory: { interactions: {} },
	}
}

function generateRandomPlayerInfo(index) {
	const gameOptions = Object.values(GameOptions)
	const yearsOfExperienceOptions = Object.values(YearsOfExperienceOptions)
	const playstyleOptions = Object.values(PlaystyleOptions)
	const firstNames = [
		"John",
		"Jane",
		"Bob",
		"Alice",
		"Mike",
		"Emily",
		"Tom",
		"Sarah",
		"David",
		"Jessica",
	]
	const lastNames = [
		"Doe",
		"Smith",
		"Johnson",
		"Williams",
		"Jones",
		"Brown",
		"Davis",
		"Miller",
		"Wilson",
		"Moore",
	]
	return {
		rosterAccountIds: [],
		games: {},
		firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
		lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
		yearsOfExperience:
			yearsOfExperienceOptions[
				Math.floor(Math.random() * yearsOfExperienceOptions.length)
			],
		location: ["USA", "Europe", "Asia"][Math.floor(Math.random() * 3)],
		willingToRelocate: Math.random() < 0.5,
		bio: `#${index} ranked player in the ${
			["USA", "Europe", "Asia"][Math.floor(Math.random() * 3)]
		} | ${gameOptions[Math.floor(Math.random() * gameOptions.length)]} certified | ${
			["Full-time", "Part-time"][Math.floor(Math.random() * 2)]
		}`,
		about: `Hello!, I'm a ${
			gameOptions[Math.floor(Math.random() * gameOptions.length)]
		} player looking to expand my reach and grow my community. I'm currently looking for a team to join and help me achieve my goals.`,
		gamingExperience: Array.from(
			{ length: Math.floor(Math.random() * 3) + 1 },
			() => gameOptions[Math.floor(Math.random() * gameOptions.length)]
		),
		playstyle: playstyleOptions[Math.floor(Math.random() * playstyleOptions.length)],
		gameUsernames: {
			[GameOptions.VALORANT]: `valorantusername${index}`,
			[GameOptions.APEX_LEGENDS]: `apexusername${index}`,
			[GameOptions.FORTNITE]: `fortniteusername${index}`,
		},
		recommendationStatistics: {},
	}
}

async function createNewTournament(teamData) {
	const result = await prisma.tournaments.findMany()
	const globalTournamentId = result[result.length - 1].id

	const newTournament = await createTournament(teamData, globalTournamentId, 16)
	return newTournament
}

async function joinTournamentWithId(tournamentId, teamAccountId) {
	const joinedTournamentData = await joinTournament(tournamentId, teamAccountId)
	return joinedTournamentData
}

async function main() {
	const generatedTeamInfos = []
	const generatedPlayerInfos = []
	const newGeneratedTeamInfos = []

	for (let i = 1; i <= 40; i++) {
		let player = generateRandomPlayerInfo(i)

		const playerAcc = await prisma.account.create({
			data: {
				accountType: "player",
				email: `player${i}@gmail.com`,
				player: {
					create: player,
				},
			},
		})
		player.accountId = playerAcc.id
		generatedPlayerInfos.push(player)
	}

	for (let i = 1; i <= 20; i++) {
		let team = generateRandomTeamInfo(i)

		if (i === 1) {
			team.rosterAccountIds.push(generatedPlayerInfos[0].accountId)
		}

		const teamAcc = await prisma.account.create({
			data: {
				accountType: "team",
				email: `team${i}@gmail.com`,
				team: {
					create: team,
				},
			},
		})
		team.accountId = teamAcc.id
		generatedTeamInfos.push(team)
	}

	for (let i = 1; i <= 2; i++) {
		for (let j = 0; j <= generatedTeamInfos.length; j++) {
			const randomPlayerNum = Math.random() * generatedPlayerInfos.length
			const randomTeamNum = Math.random() * generatedTeamInfos.length
			const allPlayers = await prisma.player.findMany()
			const allTeams = await prisma.team.findMany()

			const randomPlayer = allPlayers[Math.floor(randomPlayerNum)]
			const randomTeam = allTeams[Math.floor(randomTeamNum)]

			if (randomTeam.rosterAccountIds.includes(randomPlayer.accountId)) {
				continue
			}

			const teamUpdate = await prisma.team.update({
				where: {
					accountId: randomTeam.accountId,
				},
				data: {
					rosterAccountIds: [
						...randomTeam.rosterAccountIds,
						randomPlayer.accountId,
					],
				},
			})
			const playerUpdate = await prisma.player.update({
				where: {
					accountId: randomPlayer.accountId,
				},
				data: {
					rosterAccountIds: [
						...randomPlayer.rosterAccountIds,
						randomTeam.accountId,
					],
				},
			})
			newGeneratedTeamInfos.push(teamUpdate)
		}
	}
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
