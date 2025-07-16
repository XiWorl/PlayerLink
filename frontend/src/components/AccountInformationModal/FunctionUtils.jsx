import { AccountType } from "../../utils/globalUtils"
export const VALID_INPUT_CLASS = ""
export const DEFAULT_FORM_VALUE = ""
export const SUPPORTED_GAMES_FIELD = "supportedGames"
export const GAMING_EXPERIENCE_FIELD = "gamingExperience"
const DESIRED_PLAYSTYLE_FIELD = "desiredPlaystyle"

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
	setFormData((previousFormData) => {
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
	setFormData((previousFormData) => {
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

export function convertBooleanToYesOrNo(value) {
	if (value) {
		return "yes"
	} else return "no"
}
