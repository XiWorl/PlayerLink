import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ModalBody } from "../AccountInformationModal/ModalBody"
import { AccountType, BASEURL, TOKEN_SESSION_KEY } from "../../utils/globalUtils"
import "../SignupModal/SignupModal.css"

const MODAL_TITLE = "Edit Your Profile"

function convertYesOrNoToBoolean(value) {
	const YES_VALUE = "YES"
	if (value.toUpperCase() == YES_VALUE) {
		return true
	}
	return false
}

async function onSubmissionFormValid(formData, selectedAccountType, navigate) {
	const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
	const requestBody = {
		...formData,
		accountType: selectedAccountType,
	}

	if (token == null) return null

	if (selectedAccountType == AccountType.TEAM) {
		requestBody.currentlyHiring = convertYesOrNoToBoolean(formData.currentlyHiring)
		requestBody.name = formData.teamName
	} else {
		requestBody.willingToRelocate = convertYesOrNoToBoolean(
			formData.willingToRelocate
		)
	}

	try {
		const response = await fetch(`${BASEURL}/api/profiles/edit/account`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(requestBody),
		})

		if (response.ok) {
			await response.json()
			navigate(0)
		}
	} catch (error) {
		console.error("Error while trying to update account information:", error)
	}
}

export default function EditAccountButton({ accountType, accountData }) {
	const navigate = useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<>
			<button
				onClick={() => {
					setIsModalOpen(true)
				}}
			>
				Edit Profile
			</button>
			{isModalOpen && (
				<div>
					<ModalBody
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						onSubmit={(formData) =>
							onSubmissionFormValid(formData, accountType, navigate)
						}
						title={MODAL_TITLE}
						accountType={accountType}
						useSignupHeader={false}
						autoPopulatedData={accountData}
					/>
				</div>
			)}
		</>
	)
}
