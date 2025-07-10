import { useState, createContext } from "react"
import { DEFAULT_FORM_VALUE, DEFAULT_ERRORS_VALUE } from "./ComponentUtils"
import {
	handleUsernameChangeLogic,
	handleGameSelectionLogic,
	handlePlaystyleSelectionLogic,
	updateFormState,
} from "./utils"
import { AccountType } from "../../utils/globalUtils"
import PlayerForm from "./PlayerForm"
import TeamForm from "./TeamForm"
import "../SignupModal/SignupModal.css"

export const ModalBodyContext = createContext()

const DEFAULT_FORM_DATA = {
	player: {
		firstName: DEFAULT_FORM_VALUE,
		lastName: DEFAULT_FORM_VALUE,
		location: DEFAULT_FORM_VALUE,
		willingToRelocate: DEFAULT_FORM_VALUE,
		yearsOfExperience: DEFAULT_FORM_VALUE,
		gamingExperience: [],
		gameUsernames: {},
		playstyle: DEFAULT_FORM_VALUE,
	},
	team: {
		teamName: DEFAULT_FORM_VALUE,
		currentlyHiring: DEFAULT_FORM_VALUE,
		location: DEFAULT_FORM_VALUE,
		desiredPlaystyle: [],
		supportedGames: [],
		desiredSkillLevel: DEFAULT_FORM_VALUE,
	},
}

export default function ModalBody({
	isOpen,
	onClose,
	onSubmit,
	title,
	accountType,
	isHeaderActive,
}) {
	const [selectedAccountType, setSelectedAccountType] = useState(accountType)
	const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
	const [formErrors, setFormErrors] = useState(DEFAULT_ERRORS_VALUE)

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
					{isHeaderActive && (
						<>
							<div className="signup-modal-header">
								<h2>{title}</h2>
								<button className="close-button" onClick={onClose}>
									&times;
								</button>
							</div>
							<div className="account-type-selector">
								<button
									type="button"
									className={`account-type-btn ${
										selectedAccountType === AccountType.PLAYER ? "active" : ""
									}`}
									onClick={() => setSelectedAccountType(AccountType.PLAYER)}
								>
									Player
								</button>
								<button
									type="button"
									className={`account-type-btn ${
										selectedAccountType === AccountType.TEAM ? "active" : ""
									}`}
									onClick={() => setSelectedAccountType(AccountType.TEAM)}
								>
									Team
								</button>
							</div>{" "}
						</>
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
