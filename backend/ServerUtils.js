export const AccountType = { PLAYER: "player", TEAM: "team" }
export const LOCATION_OPTIONS = {
	USA: "USA",
	CANADA: "Canada",
	MEXICO: "Mexico",
	SOUTH_AMERICA: "South America",
	EUROPE: "Europe",
	AFRICA: "Africa",
	ASIA: "Asia",
	OCEANIA: "Oceania",
}

export const YearsOfExperienceOptions = Object.freeze({
	ZERO_TO_ONE: "0-1",
	TWO_TO_THREE: "2-3",
	FOUR_TO_FIVE: "4-5",
	SIX_TO_TEN: "6-10",
	TENPLUS: "10+",
})

export const GameOptions = {
	VALORANT: "Valorant",
	FORTNITE: "Fortnite",
	APEX_LEGENDS: "Apex Legends",
}
export const PlaystyleOptions = {
	AGGRESSIVE: "Aggressive",
	DEFENSIVE: "Defensive",
	ADAPTABLE: "Adaptable",
	TACTICAL: "Tactical",
	BALANCED: "Balanced",
	SUPPORTIVE: "Supportive",
}
export const SkillLevelOptions = {
	SEMI_PRO: "Semi-Pro",
	PRO: "Pro",
	ELITE: "Elite",
}

export function convertYesOrNoToBoolean(value) {
	const YES_VALUE = "yes"
	if (value.toLowerCase() == YES_VALUE) {
		return true
	} else return false
}
