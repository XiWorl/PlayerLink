import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import "./LoginForm.css"

function onLoginSuccess(navigate) {
	return function (credentialResponse) {
		const token = jwtDecode(credentialResponse.credential)
		localStorage.setItem("GoogleLoginToken", JSON.stringify(token))

		navigate("/profile")
	}
}

export default function LoginForm() {
	const navigate = useNavigate()

	return (
		<div className="login-form-container">
			<div className="login-form-card">
				<h2 className="login-form-title">Login with Google</h2>
				<div className="google-signin-wrapper">
					<GoogleLogin onSuccess={onLoginSuccess(navigate)} />
				</div>
			</div>
		</div>
	)
}
