import "../SignupModal/SignupModal.css"

export function ModalHeader({ title, setIsModalOpen }) {
	return (
		<div className="signup-modal-header">
			<h2>{title}</h2>
			<button className="close-button" onClick={() => setIsModalOpen(false)}>
				&times;
			</button>
		</div>
	)
}

export function CustomizableModal({ components }) {
	return (
		<div className="signup-modal-overlay">
			<div className="signup-modal-content">
				{components.map(function (component) {
					return component
				})}
			</div>
		</div>
	)
}
