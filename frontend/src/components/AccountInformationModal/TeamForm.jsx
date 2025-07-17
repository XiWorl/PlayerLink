import { useContext } from "react"
import { ModalBodyContext } from "./ModalBody.jsx"
import { SUPPORTED_GAMES_FIELD } from "./FunctionUtils.jsx"
import {
	TextFormField,
	LocationDropdown,
	YesOrNoDropdown,
	PlaystyleSelection,
	GamesSelection,
	DesiredSkillLevelDropdown,
	DEFAULT_FORM_VALUE,
} from "./ComponentUtils.jsx"

const EMPTY_FORM_FIELD = ""
const GAME_USERNAMES_FIELD = "gameUsernames"

function validateForm(
	formData,
	setFormErrors,
	onSubmit,
	handleClose,
	selectedAccountType
) {
	return function (event) {
		event.preventDefault()

		let isFormValid = true
		const newErrors = { [selectedAccountType]: {} }
		const currentFormData = formData[selectedAccountType]

		for (const key in currentFormData) {
			if (key === SUPPORTED_GAMES_FIELD || key === GAME_USERNAMES_FIELD) continue

			const inputValue =
				typeof currentFormData[key] === "string"
					? currentFormData[key].trim()
					: currentFormData[key]

			if (inputValue === DEFAULT_FORM_VALUE || inputValue === EMPTY_FORM_FIELD) {
				newErrors[selectedAccountType][key] = `${key} is required`
				isFormValid = false
			}
		}

		if (currentFormData.supportedGames.length === 0) {
			newErrors[selectedAccountType].supportedGames =
				"Please select at least one supported game"
			isFormValid = false
		}

		if (currentFormData.desiredPlaystyle.length === 0) {
			newErrors[selectedAccountType].desiredPlaystyle =
				"Please select at least one desired playstyle"
			isFormValid = false
		}

		setFormErrors(newErrors)

		if (isFormValid) {
			onSubmit(currentFormData, selectedAccountType)
			handleClose()
		}

		return isFormValid
	}
}

export default function TeamForm({ onClose, onSubmit }) {
	const { formData, setFormErrors, handleClose, selectedAccountType } =
		useContext(ModalBodyContext)

	return (
		<form
			onSubmit={validateForm(
				formData,
				setFormErrors,
				onSubmit,
				handleClose,
				selectedAccountType
			)}
			className="signup-form"
		>
			<TextFormField
				title="Team Name"
				isRequired={true}
				elementName="teamName"
				placeholder="Enter your team name"
			/>

			<LocationDropdown />
			<YesOrNoDropdown title="Currently Hiring" elementName="currentlyHiring" />
			<PlaystyleSelection />
			<GamesSelection title="Supported Games" elementName="supportedGames" />
			<DesiredSkillLevelDropdown />

			<div className="form-actions">
				<button type="button" className="cancel-btn" onClick={onClose}>
					Cancel
				</button>
				<button type="submit" className="submit-btn">
					Submit
				</button>
			</div>
		</form>
	)
}
