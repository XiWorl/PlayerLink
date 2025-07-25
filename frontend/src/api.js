import {
	AccountType,
	BASEURL,
	TOKEN_SESSION_KEY,
	ACCOUNT_INFORMATION_KEY,
} from "./utils/globalUtils"

export const LOGIN_FAILURE = "LOGIN_FAILURE"
const PENDING_APPLICATION_STATUS = "pending"

export async function onLoginAttempt(email) {
	try {
		const response = await fetch(`${BASEURL}/api/login/?email=${email}`)

		if (response.ok === true) {
			const accountData = await response.json()

			sessionStorage.setItem(TOKEN_SESSION_KEY, accountData.token)
			sessionStorage.setItem(ACCOUNT_INFORMATION_KEY, JSON.stringify(accountData))
			return accountData
		} else {
			return LOGIN_FAILURE
		}
	} catch {
		console.error(`Error while trying to login with ${email}, redirecting to signup`)
	}
}

export async function getProfileData(accountType, accountId) {
	const accountNavigation = accountType === AccountType.PLAYER ? "profiles" : "teams"
	try {
		const response = await fetch(`${BASEURL}/${accountNavigation}/${accountId}`)
		const profileData = await response.json()
		return profileData
	} catch (error) {
		console.error("Error retrieving profile data:", error)
	}
}

export async function getApplicationsFromAccountId(accountId) {
	try {
		const response = await fetch(`${BASEURL}/account/applications/${accountId}`)
		const applicationsData = await response.json()
		return applicationsData
	} catch (error) {
		return null
	}
}

export async function createTeamApplication(playerAccountId, teamAccountId) {
	try {
		const response = await fetch(`${BASEURL}/account/application`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				teamAccountId: teamAccountId,
				playerAccountId: playerAccountId,
				status: PENDING_APPLICATION_STATUS,
			}),
		})
		const teamApplication = await response.json()
		return teamApplication
	} catch (error) {
		console.error("Error creating application:", error)
	}
}

export async function createNewTournament(teamAccountId) {
	try {
		const response = await fetch(`${BASEURL}/api/tournaments/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				teamAccountId: teamAccountId,
			}),
		})
		const newTournament = await response.json()
		return newTournament
	} catch (error) {
		console.error("Error creating new tournament:", error)
	}
}

export async function getAllTournaments() {
	try {
		const response = await fetch(`${BASEURL}/api/tournaments`)
		const tournamentsData = await response.json()
		return tournamentsData
	} catch {
		console.error(`Error while trying to login with ${email}, redirecting to signup`)
		return null
	}
}

export async function getTournament(tournamentId) {
	try {
		const response = await fetch(`${BASEURL}/api/tournament/${tournamentId}`)
		const tournamentsData = await response.json()
		return tournamentsData
	} catch {
		console.error(`Error while trying to get tournament with id ${tournamentId}`)
		return null
	}
}

export async function incrementProfileVisit(playerAccountId, teamAccountId) {
	const response = await fetch(`${BASEURL}/api/profiles/visit`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			playerAccountId: playerAccountId,
			teamAccountId: teamAccountId,
		}),
	})
	const data = await response.json()
	return data
}

export async function getRecommendations(accountId) {
	try {
		const response = await fetch(
			`${BASEURL}/api/recommendations/?accountId=${accountId}`
		)
		const recommendationsData = await response.json()
		return recommendationsData
	} catch (error) {
		console.error("Error retrieving recommendations:", error)
	}
}

export async function updateRecommendationStatus(playerAccountId, teamAccountId, status) {
	try {
		const response = await fetch(`${BASEURL}/api/recommendations/update/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				playerAccountId: playerAccountId,
				teamAccountId: teamAccountId,
				status: status,
			}),
		})
		const recommendationsData = await response.json()
		return recommendationsData
	} catch (error) {
		console.error("Error retrieving recommendations:", error)
	}
}
