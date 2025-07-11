import { DEFAULT_FORM_VALUE } from "./ComponentUtils"

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
	setFormData(function (previousValue) {
		const currentFormData = previousValue[selectedAccountType]
		const gamesField =
			selectedAccountType === "team" ? "supportedGames" : "gamingExperience"
		const isGameAlreadySelected = currentFormData[gamesField].includes(game)
		const newGameUsernames = { ...currentFormData.gameUsernames }

		if (isGameAlreadySelected) {
			delete newGameUsernames[game]
		}

		return {
			...previousValue,
			[selectedAccountType]: {
				...currentFormData,
				[gamesField]: isGameAlreadySelected
					? currentFormData[gamesField].filter(
							(previousGame) => previousGame !== game
					  )
					: [...currentFormData[gamesField], game],
				gameUsernames: newGameUsernames,
			},
		}
	})

	setFormErrors(function (previousValue) {
		const gamesField =
			selectedAccountType === "team" ? "supportedGames" : "gamingExperience"
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
	setFormData(function (previousValue) {
		const currentFormData = previousValue[selectedAccountType]
		const playstyleField = "desiredPlaystyle"
		const isPlaystyleAlreadySelected =
			currentFormData[playstyleField].includes(playstyle)

		return {
			...previousValue,
			[selectedAccountType]: {
				...currentFormData,
				[playstyleField]: isPlaystyleAlreadySelected
					? currentFormData[playstyleField].filter(
							(previousPlaystyle) => previousPlaystyle !== playstyle
					  )
					: [...currentFormData[playstyleField], playstyle],
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
