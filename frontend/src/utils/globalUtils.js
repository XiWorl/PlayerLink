export const GOOGLE_EMAIL_KEY = "GoogleEmail"
export const TOKEN_SESSION_KEY = "Token"
export const ACCOUNT_INFORMATION_KEY = "AccountInformation"
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
export const GameOptions = Object.freeze({
	VALORANT: "Valorant",
	APEX_LEGENDS: "Apex Legends",
	FORTNITE: "Fortnite",
})
export const PlaystyleOptions = {
	TACTICAL: "Tactical",
	AGGRESSIVE: "Aggressive",
	DEFENSIVE: "Defensive",
	BALANCED: "Balanced",
	SUPPORTIVE: "Supportive",
	ADAPTABLE: "Adaptable",
}
export const SkillLevelOptions = Object.freeze({
	SEMI_PRO: "Semi-Pro",
	PRO: "Pro",
	ELITE: "Elite",
})

export function isLoggedIn() {
	return (
		sessionStorage.getItem(ACCOUNT_INFORMATION_KEY) !== null &&
		sessionStorage.getItem(TOKEN_SESSION_KEY) !== null
	)
}

export function getAccountDataFromSessionStorage() {
	const accountInformation = sessionStorage.getItem(ACCOUNT_INFORMATION_KEY)
	const parsedAccountInformation = accountInformation && JSON.parse(accountInformation)

	if (
		!parsedAccountInformation ||
		!parsedAccountInformation.id ||
		!parsedAccountInformation.accountType
	)
		return null
	return parsedAccountInformation
}
