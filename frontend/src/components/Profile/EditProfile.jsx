import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createContext } from "react"
import { getProfileData } from "../../api"
import {
	AccountType,
	BASEURL,
	TOKEN_STORAGE_KEY,
	getAccountDataFromLocalStorage,
} from "../../utils/globalUtils"
import ModalBody from "../TheModal/ModalBody"
import "../SignupModal/SignupModal.css"
export const SignupModalContext = createContext()

async function onFormValid(formData, selectedAccountType, navigate) {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)
	if (token == null) {
		return
	}

	const body = {
		...formData,
	}
	console.log("We here:", body)

	try {
		const response = await fetch(`${BASEURL}/api/profiles/edit/account`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		})
		await response.json()
		navigate(0)
	} catch (error) {
		console.log("Error:", error)
	}

}

async function autoPopulateForm(accountType, setAutoPopulatedData) {
	const accountData = getAccountDataFromLocalStorage()
	const profileData = await getProfileData(accountType, accountData.id)
	setAutoPopulatedData(profileData)
}

export default function EditProfileButton() {
	const navigate = useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [autoPopulatedData, setAutoPopulatedData] = useState(null)

	useEffect(() => {
		autoPopulateForm(AccountType.PLAYER, setAutoPopulatedData)
	}, [])

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
						autoPopulatedData={autoPopulatedData}
					/>
				</div>
			)}{" "}
		</>
	)
}
