export const GOOGLE_EMAIL_KEY = "GoogleEmail"
export const BASEURL = import.meta.env.VITE_RENDER_LINK || "http://localhost:3000"
export const AccountType = Object.freeze({
	PLAYER: "player",
	TEAM: "team",
})

const YES_VALUE = "yes"

export function isLoggedIn() {
	return localStorage.getItem(GOOGLE_EMAIL_KEY) !== null
}
