import { useState } from "react"
import { createContext } from "react"
import { AccountType } from "./utils"
import { Header } from "./Header"
import { DEFAULT_ERRORS_VALUE } from "./utils"
import SignupForm from "./SignupForm"
import "./SignupModal.css"
export const SignupModalContext = createContext()

const DEFAULT_FORM_VALUE = ""

function updateFormState(event, setFormData, setFormErrors, selectedAccountType) {
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

export default function SignupModal({ isOpen, onClose }) {
	const DEFAULT_FORM_DATA = {
		player: {
			firstName: DEFAULT_FORM_VALUE,
			lastName: DEFAULT_FORM_VALUE,
			location: DEFAULT_FORM_VALUE,
			willingToRelocate: DEFAULT_FORM_VALUE,
			yearsOfExperience: DEFAULT_FORM_VALUE,
		},
		team: {
			teamName: DEFAULT_FORM_VALUE,
			hiring: DEFAULT_FORM_VALUE,
			yearEstablished: DEFAULT_FORM_VALUE,
			location: DEFAULT_FORM_VALUE,
		},
	}

	const [selectedAccountType, setSelectedAccountType] = useState(AccountType.PLAYER)
	const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
	const [formErrors, setFormErrors] = useState(DEFAULT_ERRORS_VALUE)

	function handleInputChange(event) {
		updateFormState(event, setFormData, setFormErrors, selectedAccountType)
	}

	if (!isOpen) return null

	return (
		<SignupModalContext.Provider
			value={{
				formData,
				formErrors,
				handleInputChange,
				selectedAccountType,
				AccountType,
				setFormErrors,
				setSelectedAccountType,
				setFormData,
				DEFAULT_FORM_DATA,
			}}
		>
			<div className="signup-modal-overlay">
				<div className="signup-modal-content">
					<Header onClose={onClose} />
					<SignupForm onClose={onClose} />
				</div>
			</div>
		</SignupModalContext.Provider>
	)
}
