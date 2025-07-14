export const YearsOfExperienceOptions = Object.freeze({
	ZERO_TO_ONE: "0-1",
	TWO_TO_THREE: "2-3",
	FOUR_TO_FIVE: "4-5",
	SIX_TO_TEN: "6-10",
	TENPLUS: "10+",
})
export function translateExperience(yearsOfExperience) {
    if (yearsOfExperience === YearsOfExperienceOptions.ZERO_TO_ONE || yearsOfExperience === YearsOfExperienceOptions.TWO_TO_THREE) {
        return "Semi-Pro"
    } else if (yearsOfExperience === YearsOfExperienceOptions.FOUR_TO_FIVE || yearsOfExperience === YearsOfExperienceOptions.SIX_TO_TEN) {
        return "Pro"
    } else if (yearsOfExperience === YearsOfExperienceOptions.TENPLUS) {
        return "Elite"
    }
}
