import { GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import './LoginForm.css';

function GoogleSignIn({ onSuccess }) {
    return (
        <div className="google-signin-wrapper">
            <GoogleLogin onSuccess={onSuccess} />
        </div>
    )
}

function onLoginSuccess(navigate) {
    return (credentialResponse) => {
        navigate(`/profile`, {
            state: { token: jwtDecode(credentialResponse.credential) }
        });
    }
};

export default function LoginForm() {
    const navigate = useNavigate();

    return (
        <div className="login-form-container">
            <div className="login-form-card">
                <h2 className="login-form-title">Login with Google</h2>
                <GoogleSignIn onSuccess={onLoginSuccess(navigate)} />
            </div>
        </div>
    )
}
