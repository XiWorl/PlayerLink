const ACTIVE_BUTTON_CLASS = "active"
const INACTIVE_BUTTON_CLASS = ""
import { AccountType } from "./utils"
import { useContext } from "react"
import { SignupModalContext } from "./SignupModal.jsx"
import { DEFAULT_ERRORS_VALUE } from "./utils"

export function Header({ onClose }) {
	const {
		selectedAccountType,
		setSelectedAccountType,
		setFormErrors,
		setFormData,
		DEFAULT_FORM_DATA,
	} = useContext(SignupModalContext)

	function onAccountTypeChange(accountTypeName) {
		setSelectedAccountType(accountTypeName)
		setFormData(DEFAULT_FORM_DATA)
		setFormErrors(DEFAULT_ERRORS_VALUE)
	}

	return (
		<>
			<div className="signup-modal-header">
				<h2>Create Account</h2>
				<button className="close-button" onClick={onClose}>
					&times;
				</button>
			</div>

			<div className="account-type-selector">
				<button
					className={`account-type-btn ${
						selectedAccountType === AccountType.PLAYER
							? ACTIVE_BUTTON_CLASS
							: INACTIVE_BUTTON_CLASS
					}`}
					onClick={() => onAccountTypeChange(AccountType.PLAYER)}
				>
					Player Account
				</button>
				<button
					className={`account-type-btn ${
						selectedAccountType === AccountType.TEAM
							? ACTIVE_BUTTON_CLASS
							: INACTIVE_BUTTON_CLASS
					}`}
					onClick={() => onAccountTypeChange(AccountType.TEAM)}
				>
					Team Account
				</button>
			</div>
		</>
	)
}
