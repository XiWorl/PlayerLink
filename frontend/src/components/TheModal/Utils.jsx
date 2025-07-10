import { DEFAULT_FORM_VALUE } from "./ComponentUtils"

export function updateFormState(event, setFormData, setFormErrors) {
	const { name, value } = event.target

	setFormData(function (previousValue) {
		return {
			...previousValue,
			[name]: value,
		}
	})

	setFormErrors(function (previousValue) {
		return {
			...previousValue,
			[name]: DEFAULT_FORM_VALUE,
		}
	})
}

export function handleGameSelectionLogic(game, setFormData, setFormErrors) {
	setFormData(function (previousValue) {
		const isGameAlreadySelected = previousValue.gamesPlayed.includes(game)
		const newGameUsernames = { ...previousValue.gameUsernames }

		if (isGameAlreadySelected) {
			delete newGameUsernames[game]
		}

		return {
			...previousValue,
			gamesPlayed: isGameAlreadySelected
				? previousValue.gamesPlayed.filter((previousGame) => previousGame !== game)
				: [...previousValue.gamesPlayed, game],
			gameUsernames: newGameUsernames,
		}
	})

	setFormErrors(function (previousValue) {
		return {
			...previousValue,
			gamesPlayed: DEFAULT_FORM_VALUE,
		}
	})
}

export function handleUsernameChangeLogic(game, username, setFormData) {
	setFormData(function (previousValue) {
		return {
			...previousValue,
			gameUsernames: {
				...previousValue.gameUsernames,
				[game]: username,
			},
		}
	})
}
