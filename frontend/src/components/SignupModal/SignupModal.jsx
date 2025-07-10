import { useState } from "react"
import { createContext } from "react"
import { AccountType } from "../../utils/globalUtils"
import ModalBody from "../TheModal/ModalBody"
import "./SignupModal.css"
export const SignupModalContext = createContext()

export default function SignupModal({ onClose }) {
	const [selectedAccountType, setSelectedAccountType] = useState(AccountType.PLAYER)
	const [isModalOpen, setIsModalOpen] = useState(true)
	const handleSubmit = (formData) => {
		console.log("User data:", formData)
	}

	const handleClose = () => {
		setIsModalOpen(false)
		onClose()
		console.log("Closing signup modal")
	}

	const title = "Sign Up"

	if (isModalOpen === false) return

	return (
		<div>
			<ModalBody
				isOpen={isModalOpen}
				onClose={handleClose}
				onSubmit={handleSubmit}
				title={title}
				accountType={selectedAccountType}
				isHeaderActive={true}
			/>
		</div>
	)
}
