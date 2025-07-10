import { useState, createContext } from "react"
import { Header } from "./Header"
import { DEFAULT_FORM_VALUE, DEFAULT_ERRORS_VALUE } from "./ComponentUtils"
import {
	handleUsernameChangeLogic,
	handleGameSelectionLogic,
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
		gamesPlayed: [],
		gameUsernames: {},
		playStyle: DEFAULT_FORM_VALUE,
	},
	team: {
		teamName: DEFAULT_FORM_VALUE,
		currentlyHiring: DEFAULT_FORM_VALUE,
		location: DEFAULT_FORM_VALUE,
		desiredPlaystyle: DEFAULT_FORM_VALUE,
		supportedGames: [],
		desiredSkillLevel: DEFAULT_FORM_VALUE,
	},
}

export default function ModalBody({ isOpen, onClose, onSubmit, title, accountType }) {
	const [selectedAccountType, _setSelectedAccountType] = useState(accountType)
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

	function handleClose() {
		setFormData(DEFAULT_FORM_DATA)
		setFormErrors(DEFAULT_ERRORS_VALUE)
		onClose()
	}

	if (!isOpen) return null

	return (
		<ModalBodyContext.Provider
			value={{
				formData,
				formErrors,
				handleInputChange,
				handleGameSelection,
				handleUsernameChange,
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
					<Header onClose={handleClose} title={title} />

					{/* <div className="account-type-selector">
						<button
							type="button"
							className={`account-type-btn ${
								selectedAccountType === "player" ? "active" : ""
							}`}
							onClick={() => setSelectedAccountType("player")}
						>
							Player
						</button>
						<button
							type="button"
							className={`account-type-btn ${
								selectedAccountType === "team" ? "active" : ""
							}`}
							onClick={() => setSelectedAccountType("team")}
						>
							Team
						</button>
					</div> */}

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
