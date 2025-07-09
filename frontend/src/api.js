import {
	AccountType,
	BASEURL,
	TOKEN_STORAGE_KEY,
	ACCOUNT_INFORMATION_KEY,
} from "./utils/globalUtils"

export const LOGIN_FAILURE = "LOGIN_FAILURE"
const PENDING_APPLICATION_STATUS = "pending"

export async function onLoginAttempt(email) {
	try {
		const response = await fetch(`${BASEURL}/api/login/?email=${email}`)

		if (response.ok === true) {
			const accountData = await response.json()

			localStorage.setItem(TOKEN_STORAGE_KEY, accountData.token)
			localStorage.setItem(ACCOUNT_INFORMATION_KEY, JSON.stringify(accountData))
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
				status: PENDING_APPLICATION_STATUS
			}),
		})
		const data = await response.json()
		return data
	} catch (error) {
		console.error("Error creating application:", error)
	}
}
