import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createContext } from "react"
import {
	AccountType,
	GOOGLE_EMAIL_KEY,
	BASEURL,
	TOKEN_STORAGE_KEY,
} from "../../utils/globalUtils"
import ModalBody from "../TheModal/ModalBody"
import "../SignupModal/SignupModal.css"
export const SignupModalContext = createContext()

async function onFormValid(formData, selectedAccountType, navigate) {
	const body = {
		...formData,
		email: sessionStorage.getItem(GOOGLE_EMAIL_KEY),
	}
	console.log("We here:", body)
}

export default function EditProfileButton() {
	const navigate = useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleSubmit = (formData, accountType) => {
		console.log("User data:", formData)
		onFormValid(formData, accountType, navigate)
	}

	const handleClose = () => {
		setIsModalOpen(false)
	}

	const title = "Edit your profile"

	return (
		<>
			<button
				onClick={() => {
					setIsModalOpen(true)
				}}
			>
				Edit your profile
			</button>
			{isModalOpen && (
				<div>
					<ModalBody
						isOpen={isModalOpen}
						onClose={handleClose}
						onSubmit={handleSubmit}
						title={title}
						accountType={AccountType.PLAYER}
						useSignupHeader={false}
					/>
				</div>
			)}{" "}
		</>
	)
}
