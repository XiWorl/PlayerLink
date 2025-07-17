import { useState, createContext, useEffect } from "react"
import {
	DEFAULT_FORM_DATA,
	DEFAULT_ERRORS_VALUE,
	autoPopulateData,
} from "./UserInputUtils"
import { PlayerForm } from "./PlayerForm"
import { AccountType } from "../../utils/globalUtils"
import TeamForm from "./TeamForm"
import SignupHeader from "./SignupHeader"
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

					{selectedAccountType === AccountType.PLAYER ? (
						<PlayerForm onClose={onClose} onSubmit={onSubmit} />
					) : (
						<TeamForm onClose={onClose} onSubmit={onSubmit} />
					)}
				</div>
			</div>
		</ModalBodyContext.Provider>
	)
}
