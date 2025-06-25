import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode";
import './LoginForm.css';

function onLoginSuccess(credentialResponse) {
    //TODO: Continue login flow and utilize data with jwtDecode(credentialResponse.credential);
}

function GoogleSignIn() {
    return (
        <div className="google-signin-wrapper">
            <GoogleLogin onSuccess={onLoginSuccess} />
        </div>
    )
}


export default function LoginForm() {
    return (
        <div className="login-form-container">
            <div className="login-form-card">
                <h2 className="login-form-title">Login with Google</h2>
                <GoogleSignIn />
            </div>
        </div>
    )
}
