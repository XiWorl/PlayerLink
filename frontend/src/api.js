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
		return null
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
		console.error("Error updating recommendations:", error)
		return null
	}
}

// Message API methods
export async function sendMessage(receiverId, content) {
	try {
		const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
		const response = await fetch(`${BASEURL}/api/messages/send`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ receiverId, content }),
		})

		if (!response.ok) {
			console.error(`Error sending message: ${response.status}`)
			return null
		}

		return await response.json()
	} catch (error) {
		console.error("Error sending message:", error)
		return null
	}
}

export async function markMessageAsRead(messageId) {
	try {
		const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
		const response = await fetch(`${BASEURL}/api/messages/read/${messageId}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			console.error(`Error marking message as read: ${response.status}`)
			return null
		}

		return await response.json()
	} catch (error) {
		console.error("Error marking message as read:", error)
		return null
	}
}

export async function markAllMessagesAsRead(userId) {
	try {
		const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
		const response = await fetch(`${BASEURL}/api/messages/read-all/${userId}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			console.error(`Error marking all messages as read: ${response.status}`)
			return null
		}

		return await response.json()
	} catch (error) {
		console.error("Error marking all messages as read:", error)
		return null
	}
}

export async function getConversation(userId) {
	try {
		const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
		const response = await fetch(`${BASEURL}/api/messages/conversation/${userId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			console.error(`Error getting conversation: ${response.status}`)
			return null
		}

		return await response.json()
	} catch (error) {
		console.error("Error getting conversation:", error)
		return null
	}
}

export async function getConversations() {
	try {
		const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
		const response = await fetch(`${BASEURL}/api/messages/conversations`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			console.error(`Error getting conversations: ${response.status}`)
			return null
		}

		return await response.json()
	} catch (error) {
		console.error("Error getting conversations:", error)
		return null
	}
}

export async function getUnreadCount() {
	try {
		const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
		const response = await fetch(`${BASEURL}/api/messages/unread-count`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			console.error(`Error getting unread count: ${response.status}`)
			return 0
		}

		const data = await response.json()
		return data.count
	} catch (error) {
		console.error("Error getting unread count:", error)
		return 0
	}
}

// No default export needed as we're using named exports
