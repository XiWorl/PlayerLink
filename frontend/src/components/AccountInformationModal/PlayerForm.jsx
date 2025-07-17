import { useContext } from "react"
import { ModalBodyContext } from "./ModalBody.jsx"
import { GAMING_EXPERIENCE_FIELD } from "./FunctionUtils.jsx"
import {
	TextFormField,
	LocationDropdown,
	YesOrNoDropdown,
	ExperienceDropdown,
	PlayStyleDropdown,
	GamesSelection,
	DEFAULT_FORM_VALUE,
} from "./ComponentUtils.jsx"

const optionalFields = ["lastName"]
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
			if (key === GAMING_EXPERIENCE_FIELD || key === GAME_USERNAMES_FIELD) continue

			const inputValue =
				typeof currentFormData[key] === "string"
					? currentFormData[key].trim()
					: currentFormData[key]

			if (inputValue === DEFAULT_FORM_VALUE || inputValue === EMPTY_FORM_FIELD) {
				if (optionalFields.includes(key)) continue
				newErrors[selectedAccountType][key] = `${key} is required`
				isFormValid = false
			}
		}

		if (currentFormData.gamingExperience.length === 0) {
			newErrors[selectedAccountType].gamingExperience =
				"Please select at least one game"
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

export default function PlayerForm({ onClose, onSubmit }) {
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
				title="First Name"
				isRequired={true}
				elementName="firstName"
				placeholder="Enter your first name"
			/>

			<TextFormField
				title="Last Name"
				isRequired={false}
				elementName="lastName"
				placeholder="Enter your last name (optional)"
			/>

			<LocationDropdown />

			<YesOrNoDropdown
				title="Willing to Relocate"
				elementName="willingToRelocate"
			/>

			<ExperienceDropdown />

			<GamesSelection title="Gaming experience" elementName="gamingExperience" />

			<PlayStyleDropdown />

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
