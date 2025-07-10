import { useState, createContext } from "react"
import { Header } from "./Header"
import { DEFAULT_FORM_VALUE, DEFAULT_ERRORS_VALUE } from "./ComponentUtils"
import { handleUsernameChangeLogic, handleGameSelectionLogic, updateFormState } from "./utils"
import UserInfoForm from "./PlayerForm"
import "../SignupModal/SignupModal.css"

export const UserInfoModalContext = createContext()

const DEFAULT_FORM_DATA = {
	firstName: DEFAULT_FORM_VALUE,
	lastName: DEFAULT_FORM_VALUE,
	location: DEFAULT_FORM_VALUE,
	willingToRelocate: DEFAULT_FORM_VALUE,
	yearsOfExperience: DEFAULT_FORM_VALUE,
	gamesPlayed: [],
	gameUsernames: {},
	playStyle: DEFAULT_FORM_VALUE,
}



export default function UserInfoModal({ isOpen, onClose, onSubmit, title }) {
	const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
	const [formErrors, setFormErrors] = useState(DEFAULT_ERRORS_VALUE)

	function handleInputChange(event) {
		updateFormState(event, setFormData, setFormErrors)
	}

	function handleGameSelection(game) {
		handleGameSelectionLogic(game, setFormData, setFormErrors)
	}

	function handleUsernameChange(game, username) {
		handleUsernameChangeLogic(game, username, setFormData)
	}

	function handleClose() {
		setFormData(DEFAULT_FORM_DATA)
		setFormErrors(DEFAULT_ERRORS_VALUE)
		onClose()
	}

	if (!isOpen) return null

	return (
		<UserInfoModalContext.Provider
			value={{
				formData,
				formErrors,
				handleInputChange,
				handleGameSelection,
				handleUsernameChange,
				setFormErrors,
				setFormData,
				handleClose,
			}}
		>
			<div className="signup-modal-overlay" onClick={handleClose}>
				<div
					className="signup-modal-content"
					onClick={(event) => event.stopPropagation()}
				>
					<Header onClose={handleClose} title={title} />
					<UserInfoForm onClose={onClose} onSubmit={onSubmit} />
				</div>
			</div>
		</UserInfoModalContext.Provider>
	)
}
