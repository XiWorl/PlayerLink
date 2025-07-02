import { AccountType } from "./components/SignupModal/utils"
export const LOGIN_FAILURE = "LOGIN_FAILURE"
const baseURL = import.meta.env.VITE_RENDER_LINK || "http://localhost:3000"

export async function onLoginAttempt(email) {
	try {
		const response = await fetch(`${baseURL}/api/login/?email=${email}`)

		if (response.ok === true) {
			const data = await response.json()
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
		const response = await fetch(`${baseURL}/${accountNavigation}/${accountId}`)
		const data = await response.json()
		return data
	} catch (error) {
		console.error("Error retrieving data:", error)
	}
}
