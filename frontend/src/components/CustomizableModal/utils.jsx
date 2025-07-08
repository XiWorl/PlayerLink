import { useState } from "react"

export function ModalTextBox({ setIsModalOpen, onSubmitButtonClicked }) {
	const [text, setText] = useState("")

	return (
		<div className="modal-text">
			<textarea
				className="modal-text-box"
				value={text}
				onChange={(event) => setText(event.target.value)}
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
