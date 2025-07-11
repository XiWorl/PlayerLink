import { AccountType, BASEURL, TOKEN_STORAGE_KEY, ACCOUNT_INFORMATION_KEY } from "./utils/globalUtils"
export const LOGIN_FAILURE = "LOGIN_FAILURE"

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
	} catch (error) {
		console.error("Error while trying to login:", error)
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
