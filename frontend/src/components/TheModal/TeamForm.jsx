import { useContext } from "react"
import { UserInfoModalContext } from "./ModalBody.jsx"
import {
	TextFormField,
	LocationDropdown,
	YesOrNoDropdown,
	PlayStyleDropdown,
	GamesSelection,
	DesiredSkillLevelDropdown,
	DEFAULT_FORM_VALUE,
} from "./ComponentUtils.jsx"

const optionalFields = []

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

		// Validate required text fields
		for (const key in currentFormData) {
			if (key === "supportedGames" || key === "gameUsernames") continue

			const inputValue =
				typeof currentFormData[key] === "string"
					? currentFormData[key].trim()
					: currentFormData[key]

			if (inputValue === DEFAULT_FORM_VALUE || inputValue === "") {
				if (optionalFields.includes(key)) continue
				newErrors[selectedAccountType][key] = `${key} is required`
				isFormValid = false
			}
		}

		// Validate supported games
		if (currentFormData.supportedGames.length === 0) {
			newErrors[selectedAccountType].supportedGames =
				"Please select at least one supported game"
			isFormValid = false
		}

		setFormErrors(newErrors)

		if (isFormValid) {
			onSubmit(currentFormData)
			handleClose()
		}

		return isFormValid
	}
}

export default function TeamForm({ onClose, onSubmit }) {
	const { formData, setFormErrors, handleClose, selectedAccountType } =
		useContext(UserInfoModalContext)

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

			<PlayStyleDropdown title="Desired Playstyle" elementName="desiredPlaystyle" />

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
