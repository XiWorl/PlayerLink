import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createContext } from "react"
import { AccountType, GOOGLE_EMAIL_KEY, BASEURL, TOKEN_STORAGE_KEY } from "../../utils/globalUtils"
import ModalBody from "../TheModal/ModalBody"
import "./SignupModal.css"
export const SignupModalContext = createContext()

async function onFormValid(formData, selectedAccountType, navigate) {
	const body = {
		...formData,
		email: sessionStorage.getItem(GOOGLE_EMAIL_KEY),
	}
	console.log(formData)

	console.log("Body:", body)
	try {
		const response = await fetch(`${BASEURL}/api/signup/${selectedAccountType}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		})

		const data = await response.json()
		sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token)

		const navigationURL =
			data.accountType === AccountType.PLAYER ? "/profiles/" : "/teams/"
		navigate(`${navigationURL}${data.id}`)
	} catch (error) {
		console.error("Error while trying to create account:", error)
	}
}

export default function SignupModal({ onClose }) {
	const navigate = useNavigate()
	const [selectedAccountType, setSelectedAccountType] = useState(AccountType.PLAYER)
	const [isModalOpen, setIsModalOpen] = useState(true)

	const handleSubmit = (formData) => {
		console.log("User data:", formData)
		onFormValid(formData, selectedAccountType, navigate)
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
