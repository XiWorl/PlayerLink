import { AccountType, BASEURL, TOKEN_STORAGE_KEY } from "./utils/globalUtils"
export const LOGIN_FAILURE = "LOGIN_FAILURE"

export async function onLoginAttempt(email) {
	try {
		const response = await fetch(`${BASEURL}/api/login/?email=${email}`)

		if (response.ok === true) {
			const data = await response.json()
			localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
			return data
		} else {
			return LOGIN_FAILURE
		}
	} catch (error) {
		console.error("Error trying to login:", error)
	}
}

export async function getProfileData(accountType, accountId) {
	const accountNavigation = accountType === AccountType.PLAYER ? "profiles" : "teams"
	try {
		const response = await fetch(`${BASEURL}/${accountNavigation}/${accountId}`)
		const data = await response.json()
		return data
	} catch (error) {
		console.error("Error retrieving data:", error)
	}
}
