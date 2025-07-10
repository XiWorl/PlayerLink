export function Header({ onClose, title }) {
	return (
		<div className="signup-modal-header">
			<h2>{title}</h2>
			<button className="close-button" onClick={onClose}>
				×
			</button>
		</div>
	)
}
