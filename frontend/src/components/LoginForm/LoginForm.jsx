import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { LOGIN_FAILURE, onLoginAttempt } from "../../api.js"
import { AccountType, GOOGLE_EMAIL_KEY } from "../../utils/globalUtils.js"
import SignupModal from "../SignupModal/SignupModal"
import "./LoginForm.css"

async function onLoginSuccess(setSignupModalVisible, credentialResponse, navigate) {
	const token = jwtDecode(credentialResponse.credential)
	localStorage.setItem(GOOGLE_EMAIL_KEY, token.email)

	const loginResult = await onLoginAttempt(token.email)
	if (loginResult === LOGIN_FAILURE) {
		setSignupModalVisible(true)
		return
	}

	if (loginResult.accountType === AccountType.PLAYER) {
		navigate(`/profiles/${loginResult.id}`)
	} else {
		navigate(`/teams/${loginResult.id}`)
	}
}

function GoogleLoginCard({ setSignupModalVisible }) {
	const navigate = useNavigate()

	return (
		<div className="login-form-card">
			<h2 className="login-form-title">Login with Google</h2>
			<div className="google-signin-wrapper">
				<GoogleLogin
					onSuccess={(credentialResponse) =>
						onLoginSuccess(
							setSignupModalVisible,
							credentialResponse,
							navigate
						)
					}
				/>
			</div>
		</div>
	)
}

export default function LoginForm() {
	const [signupModalVisible, setSignupModalVisible] = useState(false)

	return (
		<div className="login-form-container">
			{signupModalVisible ? (
				<SignupModal onClose={() => setSignupModalVisible(false)} />
			) : (
				<GoogleLoginCard setSignupModalVisible={setSignupModalVisible} />
			)}
		</div>
	)
}
