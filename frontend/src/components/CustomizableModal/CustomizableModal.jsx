import "../SignupModal/SignupModal.css"

export function CustomizableModal({ components, title, setIsModalOpen }) {
	return (
		<div className="signup-modal-overlay">
			<div className="signup-modal-content">
				<div className="signup-modal-header">
					<h2>{title}</h2>
					<button
						className="close-button"
						onClick={() => setIsModalOpen(false)}
					>
						&times;
					</button>
				</div>
				{components.map(function (component) {
					return component
				})}
			</div>
		</div>
	)
}
