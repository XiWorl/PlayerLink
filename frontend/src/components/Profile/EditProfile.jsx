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
	if (selectedAccountType == AccountType.PLAYER) {
		body.willingToRelocate = convertToBoolean(body.willingToRelocate)
		delete body.email
	} else {
		body.currentlyHiring = convertToBoolean(body.currentlyHiring)
		body.name = body.teamName
		delete body.teamName
	}
	console.log("We here:", body)
	delete body.playerId
	delete body.accountId
	body.accountType = selectedAccountType

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
		// navigate(0)
	} catch (error) {
		console.log("Error:", error)
	}
}

async function autoPopulateForm(accountType, setAutoPopulatedData) {
	const accountData = getAccountDataFromLocalStorage()
	const profileData = await getProfileData(accountType, accountData.id)
	setAutoPopulatedData(profileData)
}

function convertToBoolean(value) {
	const YES_VALUE = "yes"
	if (value.toLowerCase() == YES_VALUE) {
		return true
	} else return false
}

export default function EditProfileButton({ accountType }) {
	const navigate = useNavigate()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [autoPopulatedData, setAutoPopulatedData] = useState(null)

	useEffect(() => {
		autoPopulateForm(accountType, setAutoPopulatedData)
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
						accountType={accountType}
						useSignupHeader={false}
						autoPopulatedData={autoPopulatedData}
					/>
				</div>
			)}{" "}
		</>
	)
}
