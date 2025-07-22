import { useContext } from "react"
import { ModalBodyContext } from "./ModalBody.jsx"
import { validateSubmissionFormHelper } from "./UserInputUtils.jsx"
import {
	TextFormField,
	LocationDropdown,
	YesOrNoDropdown,
	PlaystyleSelection,
	GamesSelection,
	DesiredSkillLevelDropdown,
} from "./FormInputComponents.jsx"

const OPTIONAL_FIELDS = []

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
		let isSubmissionFormValid = validateSubmissionFormHelper(
			selectedAccountType,
			newErrors,
			currentFormData,
			OPTIONAL_FIELDS
		)

		if (currentFormData.supportedGames.length === 0) {
			newErrors[selectedAccountType].supportedGames =
				"Please select at least one supported game"
			isSubmissionFormValid = false
		}

		if (currentFormData.desiredPlaystyle.length === 0) {
			newErrors[selectedAccountType].desiredPlaystyle =
				"Please select at least one desired playstyle"
			isSubmissionFormValid = false
		}

		setFormErrors(newErrors)

		if (isSubmissionFormValid) {
			onSubmit(currentFormData, selectedAccountType)
			handleClose()
		}

		return isSubmissionFormValid
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
