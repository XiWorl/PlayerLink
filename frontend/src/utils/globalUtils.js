export const GOOGLE_EMAIL_KEY = "GoogleEmail"
export const TOKEN_STORAGE_KEY = "Token"
export const BASEURL = import.meta.env.VITE_RENDER_LINK || "http://localhost:3000"
export const AccountType = Object.freeze({
	PLAYER: "player",
	TEAM: "team",
})

export const YearsOfExperienceOptions = Object.freeze({
	ZERO_TO_ONE: "0-1",
	TWO_TO_THREE: "2-3",
	FOUR_TO_FIVE: "4-5",
	SIX_TO_TEN: "6-10",
	TENPLUS: "10+",
})

export const LOCATION_OPTIONS = [
	"USA",
	"Canada",
	"Mexico",
	"South America",
	"Europe",
	"Africa",
	"Asia",
	"Oceania",
]

export function isLoggedIn() {
	return localStorage.getItem(GOOGLE_EMAIL_KEY) !== null
}
