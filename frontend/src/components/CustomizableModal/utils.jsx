import { useState } from "react"

export function onTextFieldValueChange(setText) {
	return function (event) {
		setText(event.target.value)
	}
}

export function ModalTextBox({ setIsModalOpen, onSubmitButtonClicked }) {
	const [text, setText] = useState("")

	return (
		<div className="modal-text">
			<textarea
				className="modal-text-box"
				value={text}
				onChange={onTextFieldValueChange(setText)}
			></textarea>
			<div className="modal-buttons">
				<button className="submit-btn" onClick={onSubmitButtonClicked(text)}>
					Submit
				</button>
				<button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
					Cancel
				</button>
			</div>
		</div>
	)
}
