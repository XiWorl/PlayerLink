import { useContext } from "react"
import { ModalBodyContext } from "./ModalBody.jsx"
import {
	TextFormField,
	LocationDropdown,
	YesOrNoDropdown,
	ExperienceDropdown,
	PlayStyleDropdown,
	GamesSelection,
} from "./FormInputComponents.jsx"
import { validateSubmissionFormHelper } from "./UserInputUtils.jsx"

const OPTIONAL_FIELDS = ["lastName"]

function validateForm(
	formData,
	setFormErrors,
	onSubmit,
	handleClose,
	selectedAccountType
) {
	return function (event) {
		event.preventDefault()

		const newErrors = { [selectedAccountType]: {} }
		const currentFormData = formData[selectedAccountType]
		validateSubmissionFormHelper(
			selectedAccountType,
			newErrors,
			currentFormData,
			OPTIONAL_FIELDS
		)

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

export function PlayerForm({ onClose, onSubmit }) {
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
