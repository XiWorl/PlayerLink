import { useContext } from "react"
import { SignupModalContext } from "./SignupModal.jsx"
import { AccountType } from "./utils.jsx"
import PlayerSignup from "./PlayerSignup"
import TeamSignup from "./TeamSignup"
import { DEFAULT_FORM_VALUE } from "./utils.jsx"

const optionalSignupInformation = ["lastName"]

async function onFormValid(formData, selectedAccountType) {
	const baseURL = import.meta.env.VITE_RENDER_LINK || "http://localhost:3000"
	const body = {
		...formData[selectedAccountType],
		email: localStorage.getItem("GoogleEmail"),
	}
	try {
		const response = await fetch(`${baseURL}/api/signup/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		})

		const data = await response.json()
	} catch (error) {
		console.error("Error posting data:", error)
	}
}

function validateForm(formData, selectedAccountType, setFormErrors) {
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
			? onFormValid(formData, selectedAccountType)
			: alert("Please make sure all fields are filled out")
		return formValid
	}
}

export default function SignupForm({ onClose }) {
	const { formData, selectedAccountType, setFormErrors } =
		useContext(SignupModalContext)

	return (
		<form
			onSubmit={validateForm(formData, selectedAccountType, setFormErrors)}
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
