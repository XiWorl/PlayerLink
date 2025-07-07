import "./Navbar.css"
import { useNavigate } from "react-router-dom"
import { TOKEN_STORAGE_KEY, AccountType } from "../../utils/globalUtils"
import { getProfileDataWithToken } from "../../api"
export default function Navbar() {
	return (
		<div className="navbar">
			<div className="navbar-contents">
				<div className="tournament">
					<Tournament />
				</div>
				<div className="connect">
					<ConnectButton />
				</div>
				<div className="profile">
					<ProfileIcon />
				</div>
			</div>
		</div>
	)
}

function ConnectButton() {
	const navigate = useNavigate()
	return (
		<button className="connct-btn" onClick={() => navigate("/view")}>
			<h3>Connect</h3>
		</button>
	)
}

function onProfileButtonClicked(navigate) {
	return async function () {
		const token = localStorage.getItem(TOKEN_STORAGE_KEY)
		const userProfile = await getProfileDataWithToken(token)

		if (!userProfile || userProfile.id == null || userProfile.accountType == null) {
			navigate("/")
			return
		}

		const navigationAccountType =
			userProfile.accountType === AccountType.PLAYER ? "profiles" : "teams"
		navigate(`/${navigationAccountType}/${userProfile.id}`)
	}
}

function ProfileIcon() {
	const navigate = useNavigate()
	return (
		<button className="profile-button" onClick={onProfileButtonClicked(navigate)}>
			<h3>My Profile</h3>
		</button>
	)
}

function Tournament() {
	return (
		<button className="tournament-button">
			<h3>Tournament</h3>
		</button>
	)
}
