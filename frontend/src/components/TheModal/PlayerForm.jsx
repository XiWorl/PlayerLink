import { useContext } from "react"
import { ModalBodyContext } from "./ModalBody.jsx"
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
			if (key === "gamingExperience" || key === "gameUsernames") continue

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

		// Validate games played
		if (currentFormData.gamingExperience.length === 0) {
			newErrors[selectedAccountType].gamingExperience = "Please select at least one game"
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
