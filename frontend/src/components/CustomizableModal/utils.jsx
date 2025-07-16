import { useState } from "react"

function onTextFieldValueChange(event, setText) {
	setText(event.target.value)
}

export function ModalTextBox({ setIsModalOpen, onSubmitButtonClicked }) {
	const [text, setText] = useState("")

	return (
		<div className="modal-text">
			<textarea
				className="modal-text-box"
				value={text}
				onChange={(event) => onTextFieldValueChange(event, setText)}
			></textarea>
			<div className="modal-buttons">
				<button
					className="submit-btn"
					onClick={() => {
						onSubmitButtonClicked(text)
						setIsModalOpen(false)
					}}
				>
					Submit
				</button>
				<button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
					Cancel
				</button>
			</div>
		</div>
	)
}
