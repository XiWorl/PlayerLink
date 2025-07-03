import { useState } from "react"
import "../SignupModal/SignupModal.css"

function onClose() {
	console.log("now close")
}

export function ModalTextBox() {
	const [text, setText] = useState("")

	return (
		<div className="modal-text">
			<textarea className="modal-text-box"></textarea>
			<div className="modal-buttons">
				<button className="submit-btn">Submit</button>
				<button className="cancel-btn">Cancel</button>
			</div>
		</div>
	)
}

export function CustomizableModal() {
	return (
		<div className="signup-modal-overlay">
			<div className="signup-modal-content">
				<div className="signup-modal-header">
					<h2>Edit Your Bio</h2>
					<button className="close-button" onClick={onClose}>
						&times;
					</button>
				</div>
				<ModalTextBox />
			</div>
		</div>
	)
}
