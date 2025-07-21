import dotenv from "dotenv"
dotenv.config()

const AVERAGE_KILLS_PER_VALORANT_GAME = 16
const PLATFORMS = ["PC", "PS4", "X1"]
const REGIONS = ["na", "eu", "ap"]

export async function getFortniteAccountData(username) {
	try {
		const URL = `https://fortnite-api.com/v2/stats/br/v2/?name=${username}`

		const response = await fetch(URL, {
			method: "GET",
			headers: {
				Authorization: process.env.FORTNITE_API_KEY,
			},
		})

		if (!response.ok) return null

		const fortniteAccountData = await response.json()
		const performanceData = {
			wins: fortniteAccountData.data.stats.all.overall.wins,
			kills: fortniteAccountData.data.stats.all.overall.kills,
			elo: fortniteAccountData.data.stats.all.overall.kd,
		}

		return performanceData
	} catch (error) {
		return null
	}
}

export async function getApexAccountData(username) {
	for (const platform of PLATFORMS) {
		try {
			const URL = `https://api.mozambiquehe.re/bridge?player=${username}&platform=${platform}`

			const response = await fetch(URL, {
				method: "GET",
				headers: {
					Authorization: process.env.APEX_API_KEY,
				},
			})

			if (!response.ok) continue

			const apexAccountData = await response.json()
			const performanceData = {
				wins: apexAccountData.total.career_wins.value,
				kills: apexAccountData.total.career_kills.value,
				elo: apexAccountData.global.rank.rankName,
			}
			return performanceData
		} catch (error) {
			return null
		}
	}
	return null
}

export async function getValorantPlayerData(username, tagline) {
	for (const region of REGIONS) {
		try {
			const URL = `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${username}/${tagline}`

			const response = await fetch(URL, {
				method: "GET",
				headers: {
					Authorization: process.env.VALORANT_API_KEY,
				},
			})

			if (!response.ok) continue

			const valorantAccountData = await response.json()
			if (valorantAccountData.data.length == 0) continue

			const valorantSeasonName = valorantAccountData.data.highest_rank.season
			const performanceData = {
				wins: valorantAccountData.data.by_season[valorantSeasonName].wins,
				kills:
					valorantAccountData.data.by_season[valorantSeasonName]
						.number_of_games * AVERAGE_KILLS_PER_VALORANT_GAME,
				elo: valorantAccountData.data.highest_rank.patched_tier,
			}
			return performanceData
		} catch (error) {
			return null
		}
	}
	return null
}
