import { useState } from "react"
import { AccountType } from "../../utils/globalUtils"
import { useNavigate } from "react-router-dom"
import { ModalBody } from "../AccountInformationModal/ModalBody"
import {
	BASEURL,
	GOOGLE_EMAIL_KEY,
	TOKEN_SESSION_KEY,
	ACCOUNT_INFORMATION_KEY,
} from "../../utils/globalUtils"
import LoadingScreen from "../LoadingScreen/LoadingScreen"
import "./SignupModal.css"

const MODAL_TITLE = "Create Your Account"

async function onSubmissionFormValid(
	formData,
	selectedAccountType,
	navigate,
	setIsLoading
) {
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

		if (response.ok) {
			setIsLoading(true)
		}

		const accountData = await response.json()

		sessionStorage.setItem(TOKEN_SESSION_KEY, accountData.token)
		sessionStorage.setItem(ACCOUNT_INFORMATION_KEY, JSON.stringify(accountData))
		setIsLoading(false)

		const navigationURL =
			accountData.accountType === AccountType.PLAYER ? "profiles" : "teams"
		navigate(`/${navigationURL}/${accountData.id}`)
	} catch (error) {
		console.error("Error while trying to create account:", error)
	}
}

export default function SignupModal({ onClose }) {
	const navigate = useNavigate()
	const [selectedAccountType, _setSelectedAccountType] = useState(AccountType.PLAYER)
	const [isModalOpen, setIsModalOpen] = useState(true)
	const [isLoading, setIsLoading] = useState(false)

	if (isLoading) return <LoadingScreen message={"Loading Profile..."} />

	function handleClose() {
		setIsModalOpen(false)
		onClose()
	}

	if (isModalOpen === false) return

	return (
		<div>
			<ModalBody
				isOpen={isModalOpen}
				onClose={handleClose}
				onSubmit={(submissionFormData, accountType) =>
					onSubmissionFormValid(
						submissionFormData,
						accountType,
						navigate,
						setIsLoading
					)
				}
				title={MODAL_TITLE}
				accountType={selectedAccountType}
				useSignupHeader={true}
			/>
		</div>
	)
}
