import { AccountType } from "../../utils/globalUtils"
export const VALID_INPUT_CLASS = ""
export const DEFAULT_FORM_VALUE = ""
export const SUPPORTED_GAMES_FIELD = "supportedGames"
export const GAMING_EXPERIENCE_FIELD = "gamingExperience"
export const DEFAULT_ERRORS_VALUE = Object.freeze({ player: {}, team: {} })
const DESIRED_PLAYSTYLE_FIELD = "desiredPlaystyle"
const GAME_USERNAMES_FIELD = "gameUsernames"
const EMPTY_FORM_FIELD = ""


export const DEFAULT_FORM_DATA = {
	player: {
		firstName: DEFAULT_FORM_VALUE,
		lastName: DEFAULT_FORM_VALUE,
		location: DEFAULT_FORM_VALUE,
		willingToRelocate: DEFAULT_FORM_VALUE,
		yearsOfExperience: DEFAULT_FORM_VALUE,
		gamingExperience: [],
		gameUsernames: {},
		playstyle: DEFAULT_FORM_VALUE,
	},
	team: {
		teamName: DEFAULT_FORM_VALUE,
		currentlyHiring: DEFAULT_FORM_VALUE,
		location: DEFAULT_FORM_VALUE,
		desiredPlaystyle: [],
		supportedGames: [],
		desiredSkillLevel: DEFAULT_FORM_VALUE,
	},
}

export function autoPopulateData(accountType, setFormData, autoPopulatedData) {
	if (accountType == AccountType.PLAYER) {
		autoPopulatedData.willingToRelocate = convertBooleanToYesOrNo(
			autoPopulatedData.willingToRelocate
		)
	} else {
		autoPopulatedData.currentlyHiring = convertBooleanToYesOrNo(
			autoPopulatedData.currentlyHiring
		)
		autoPopulatedData.teamName = autoPopulatedData.name
	}

	setFormData(function (prevFormData) {
		return {
			...prevFormData,
			[accountType]: {
				...prevFormData[accountType],
				...autoPopulatedData,
			},
		}
	})
}

export function updateFormState(event, setFormData, setFormErrors, selectedAccountType) {
	const { name, value } = event.target

	setFormData(function (previousValue) {
		return {
			...previousValue,
			[selectedAccountType]: {
				...previousValue[selectedAccountType],
				[name]: value,
			},
		}
	})

	setFormErrors(function (previousValue) {
		return {
			...previousValue,
			[selectedAccountType]: {
				...previousValue[selectedAccountType],
				[name]: DEFAULT_FORM_VALUE,
			},
		}
	})
}

export function handleGameSelectionLogic(
	game,
	setFormData,
	setFormErrors,
	selectedAccountType
) {
	setFormData(function (previousFormData) {
		const formData = previousFormData[selectedAccountType]
		const gamesListField =
			selectedAccountType === AccountType.TEAM
				? SUPPORTED_GAMES_FIELD
				: GAMING_EXPERIENCE_FIELD

		const isSelectedGameAlreadyIncluded = formData[gamesListField].includes(game)
		const updatedGameUsernames = { ...formData.gameUsernames }

		if (isSelectedGameAlreadyIncluded) {
			delete updatedGameUsernames[game]
		}

		const updatedGamesList = isSelectedGameAlreadyIncluded
			? formData[gamesListField].filter((existingGame) => existingGame !== game)
			: [...formData[gamesListField], game]

		return {
			...previousFormData,
			[selectedAccountType]: {
				...formData,
				[gamesListField]: updatedGamesList,
				gameUsernames: updatedGameUsernames,
			},
		}
	})

	setFormErrors(function (previousValue) {
		const gamesField =
			selectedAccountType === AccountType.TEAM
				? SUPPORTED_GAMES_FIELD
				: GAMING_EXPERIENCE_FIELD

		return {
			...previousValue,
			[selectedAccountType]: {
				...previousValue[selectedAccountType],
				[gamesField]: DEFAULT_FORM_VALUE,
			},
		}
	})
}

export function handleUsernameChangeLogic(
	game,
	username,
	setFormData,
	selectedAccountType
) {
	setFormData(function (previousValue) {
		return {
			...previousValue,
			[selectedAccountType]: {
				...previousValue[selectedAccountType],
				gameUsernames: {
					...previousValue[selectedAccountType].gameUsernames,
					[game]: username,
				},
			},
		}
	})
}

export function handlePlaystyleSelectionLogic(
	playstyle,
	setFormData,
	setFormErrors,
	selectedAccountType
) {
	setFormData(function (previousFormData) {
		const formData = previousFormData[selectedAccountType]
		const desiredPlaystyles = formData[DESIRED_PLAYSTYLE_FIELD]
		const isPlaystyleSelected = desiredPlaystyles.includes(playstyle)

		const updatedPlaystyles = isPlaystyleSelected
			? selectedPlaystyles.filter(
					(existingPlaystyle) => existingPlaystyle !== playstyle
			  )
			: [...desiredPlaystyles, playstyle]

		return {
			...previousFormData,
			[selectedAccountType]: {
				...formData,
				[DESIRED_PLAYSTYLE_FIELD]: updatedPlaystyles,
			},
		}
	})

	setFormErrors(function (previousValue) {
		return {
			...previousValue,
			[selectedAccountType]: {
				...previousValue[selectedAccountType],
				desiredPlaystyle: DEFAULT_FORM_VALUE,
			},
		}
	})
}

export function validateSubmissionFormHelper(
	selectedAccountType,
	newErrors,
	currentFormData,
	optionalFields
) {
	let isFormValid = true

	for (const key in currentFormData) {
		if (key === GAMING_EXPERIENCE_FIELD || key === GAME_USERNAMES_FIELD) continue

		const inputValue =
			typeof currentFormData[key] === "string"
				? currentFormData[key].trim()
				: currentFormData[key]

		if (inputValue === DEFAULT_FORM_VALUE || inputValue === EMPTY_FORM_FIELD) {
			if (selectedAccountType === AccountType.PLAYER) {
				if (optionalFields.includes(key)) continue
			}
			newErrors[selectedAccountType][key] = `${key} is required`
			isFormValid = false
		}
	}
	return isFormValid
}

export function convertBooleanToYesOrNo(value) {
	if (value) {
		return "yes"
	} else return "no"
}
