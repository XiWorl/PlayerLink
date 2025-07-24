import dotenv from "dotenv"
dotenv.config()

const AVERAGE_KILLS_PER_VALORANT_GAME = 16

export async function getFortnitePlayerData(username) {
	try {
		const URL = `https://fortnite-api.com/v2/stats/br/v2/?name=${username}`

		const response = await fetch(URL, {
			method: "GET",
			headers: {
				Authorization: process.env.FORTNITE_API_KEY,
			},
		})

		if (!response.ok) {
			return null
		}

		const fortnitePlayerData = await response.json()
		const performanceData = {
			wins: fortnitePlayerData.data.stats.all.overall.wins,
			kills: fortnitePlayerData.data.stats.all.overall.kills,
			elo: fortnitePlayerData.data.stats.all.overall.kd,
		}
		return performanceData
	} catch (error) {
		return null
	}
}

export async function getApexPlayerData(username) {
	const PLATFORMS = ["PC", "PS4", "X1"]

	for (const platform of PLATFORMS) {
		try {
			const URL = `https://api.mozambiquehe.re/bridge?player=${username}&platform=${platform}`

			const response = await fetch(URL, {
				method: "GET",
				headers: {
					Authorization: process.env.APEX_API_KEY,
				},
			})
			if (!response.ok) {
				continue
			}

			const apexPlayerData = await response.json()
			const performanceData = {
				wins: apexPlayerData.total.career_wins.value,
				kills: apexPlayerData.total.career_kills.value,
				elo: apexPlayerData.global.rank.rankName,
			}
			return performanceData
		} catch (error) {
			return null
		}
	}
	return null
}

export async function getValorantPlayerData(username, tagline) {
	const REGIONS = ["na", "eu", "ap"]

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

			const valorantPlayerData = await response.json()
			if (valorantPlayerData.data.length == 0) continue

			const peakSeason = valorantPlayerData.data.highest_rank.season
			const performanceData = {
				wins: valorantPlayerData.data.by_season[peakSeason].wins,
				kills:
					valorantPlayerData.data.by_season[peakSeason].number_of_games *
					AVERAGE_KILLS_PER_VALORANT_GAME,
				elo: valorantPlayerData.data.highest_rank.patched_tier,
			}
			return performanceData
		} catch (error) {
			return null
		}
	}
	return null
}
