import { useState } from "react"
import { AccountType } from "../../utils/globalUtils"
import { ModalBody } from "../AccountInformationModal/ModalBody"
import "./SignupModal.css"

async function onFormValid(formData, selectedAccountType, navigate) {
	const body = {
		...formData,
		email: sessionStorage.getItem(GOOGLE_EMAIL_KEY),
	}

	try {
		const response = await fetch(`${BASEURL}/api/signup/${selectedAccountType}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		})

		const accountData = await response.json()

		sessionStorage.setItem(TOKEN_STORAGE_KEY, accountData.token)
		sessionStorage.setItem(ACCOUNT_INFORMATION_KEY, JSON.stringify(accountData))

		const navigationURL =
			accountData.accountType === AccountType.PLAYER ? "profiles" : "teams"
		navigate(`/${navigationURL}/${accountData.id}`)
	} catch (error) {
		console.error("Error while trying to create account:", error)
	}
}

export default function SignupModal({ onClose }) {
	const [selectedAccountType, setSelectedAccountType] = useState(AccountType.PLAYER)
	const [isModalOpen, setIsModalOpen] = useState(true)

	const handleSubmit = (formData, accountType) => {
		onFormValid(formData, accountType, navigate)
	}

	function handleClose() {
		setIsModalOpen(false)
		onClose()
	}

	const title = "Sign Up"

	if (isModalOpen === false) return

	return (
		<div>
			<ModalBody
				isOpen={isModalOpen}
				onClose={handleClose}
				onSubmit={(a,b) => console.log("WE HERE",a,b)}
				title={title}
				accountType={selectedAccountType}
				useSignupHeader={true}
			/>
		</div>
	)
}
