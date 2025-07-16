import { useState, createContext, useEffect } from "react"
import {
	DEFAULT_FORM_DATA,
	DEFAULT_ERRORS_VALUE,
	autoPopulateData,
	handleUsernameChangeLogic,
	handleGameSelectionLogic,
	handlePlaystyleSelectionLogic,
	updateFormState,
} from "./FunctionUtils"
import SignupHeader from "./SignupHeader"
import { AccountType } from "../../utils/globalUtils"
import "../SignupModal/SignupModal.css"

export const ModalBodyContext = createContext()

export default function ModalBody({
	onClose,
	onSubmit,
	title,
	accountType,
	useSignupHeader,
	autoPopulatedData,
}) {
	const [selectedAccountType, setSelectedAccountType] = useState(accountType)
	const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
	const [formErrors, setFormErrors] = useState(DEFAULT_ERRORS_VALUE)

	useEffect(() => {
		autoPopulateData(accountType, setFormData, autoPopulatedData)
	}, [autoPopulatedData])

	function handleInputChange(event) {
		updateFormState(event, setFormData, setFormErrors, selectedAccountType)
	}

	function handleGameSelection(game) {
		handleGameSelectionLogic(game, setFormData, setFormErrors, selectedAccountType)
	}

	function handleUsernameChange(game, username) {
		handleUsernameChangeLogic(game, username, setFormData, selectedAccountType)
	}

	function handlePlaystyleSelection(playstyle) {
		handlePlaystyleSelectionLogic(
			playstyle,
			setFormData,
			setFormErrors,
			selectedAccountType
		)
	}

	function handleClose() {
		setFormData(DEFAULT_FORM_DATA)
		setFormErrors(DEFAULT_ERRORS_VALUE)
		onClose()
	}

	return (
		<ModalBodyContext.Provider
			value={{
				formData,
				formErrors,
				handleInputChange,
				handleGameSelection,
				handleUsernameChange,
				handlePlaystyleSelection,
				setFormErrors,
				setFormData,
				handleClose,
				selectedAccountType,
			}}
		>
			<div className="signup-modal-overlay" onClick={handleClose}>
				<div
					className="signup-modal-content"
					onClick={(event) => event.stopPropagation()}
				>
					{useSignupHeader && (
						<SignupHeader
							title={title}
							onClose={onClose}
							setSelectedAccountType={setSelectedAccountType}
						/>
					)}

					{!useSignupHeader && (
						<div className="signup-modal-header">
							<h2>{title}</h2>
							<button className="close-button" onClick={onClose}>
								&times;
							</button>
						</div>
					)}

					{/* TODO: Implement various user input fields for player and team accounts (e.g., first name, location) */}
				</div>
			</div>
		</ModalBodyContext.Provider>
	)
}
