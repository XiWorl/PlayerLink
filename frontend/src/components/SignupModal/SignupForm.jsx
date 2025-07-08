import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { SignupModalContext } from "./SignupModal.jsx"
import {
	AccountType,
	GOOGLE_EMAIL_KEY,
	BASEURL,
	TOKEN_STORAGE_KEY,
	ACCOUNT_INFORMATION_KEY
} from "../../utils/globalUtils.js"
import PlayerSignup from "./PlayerSignup"
import TeamSignup from "./TeamSignup"
import { DEFAULT_FORM_VALUE } from "./utils.jsx"

const optionalSignupInformation = ["lastName"]

async function onFormValid(formData, selectedAccountType, navigate) {
	const body = {
		...formData[selectedAccountType],
		email: localStorage.getItem(GOOGLE_EMAIL_KEY),
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
		if (!response.ok) throw new Error()

		localStorage.setItem(TOKEN_STORAGE_KEY, accountData.token)
		localStorage.setItem(ACCOUNT_INFORMATION_KEY, accountData)
		const navigationURL =
			accountData.accountType === AccountType.PLAYER ? "/profiles/" : "/teams/"

		navigate(`${navigationURL}${accountData.id}`)
	} catch (error) {
		console.error("Error while trying to create account:", error)
	}
}

function validateForm(formData, selectedAccountType, setFormErrors, navigate) {
	return function (event) {
		event.preventDefault()

		let formValid = true
		const newErrors = { player: {}, team: {} }

		for (const key in formData[selectedAccountType]) {
			const inputValue = formData[selectedAccountType][key].trim()
			if (inputValue === DEFAULT_FORM_VALUE) {
				if (optionalSignupInformation.includes(key)) continue
				newErrors[selectedAccountType][key] = `${key} is required`
				formValid = false
			}
		}
		setFormErrors(newErrors)

		formValid
			? onFormValid(formData, selectedAccountType, navigate)
			: alert("Please make sure all fields are filled out")
		return formValid
	}
}

export default function SignupForm({ onClose }) {
	const navigate = useNavigate()
	const { formData, selectedAccountType, setFormErrors } =
		useContext(SignupModalContext)

	return (
		<form
			onSubmit={validateForm(
				formData,
				selectedAccountType,
				setFormErrors,
				navigate
			)}
			className="signup-form"
		>
			{selectedAccountType === AccountType.PLAYER ? (
				<PlayerSignup />
			) : (
				<TeamSignup />
			)}

			<div className="form-actions">
				<button type="button" className="cancel-btn" onClick={onClose}>
					Cancel
				</button>
				<button type="submit" className="submit-btn">
					Create Account
				</button>
			</div>
		</form>
	)
}
