const ACTIVE_CLASS_NAME = "active"
const INACTIVE_CLASS_NAME = ""

export default function SignupHeader({ setSelectedAccountType, onClose, title }) {
	return (
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
						selectedAccountType === AccountType.PLAYER
							? ACTIVE_CLASS_NAME
							: INACTIVE_CLASS_NAME
					}`}
					onClick={() => setSelectedAccountType(AccountType.PLAYER)}
				>
					Player
				</button>
				<button
					type="button"
					className={`account-type-btn ${
						selectedAccountType === AccountType.TEAM
							? ACTIVE_CLASS_NAME
							: INACTIVE_CLASS_NAME
					}`}
					onClick={() => setSelectedAccountType(AccountType.TEAM)}
				>
					Team
				</button>
			</div>
		</>
	)
}
