import "./Navbar.css"
import { AccountType, getAccountDataFromSessionStorage } from "../../utils/globalUtils"
import { ACCOUNT_INFORMATION_KEY } from "../../utils/globalUtils"
import { Link, useNavigate } from "react-router-dom"

function navigateToUserProfile(navigate) {
	const accountData = getAccountDataFromSessionStorage()
	if (accountData === null) {
		navigate("/")
		return
	}

	const navigationPath =
		accountData.accountType === AccountType.PLAYER ? "profiles" : "teams"
	navigate(`/${navigationPath}/${accountData.id}`)
}

export default function Navbar() {
	return (
		<div className="navbar">
			<div className="navbar-contents">
				<div className="tournament">
					<TournamentsButton />
				</div>
				<div className="apply">
					<ApplyButton />
				</div>
				<div className="connect">
					<ConnectButton />
				</div>
				<div className="profile">
					<ProfileButton />
				</div>
			</div>
		</div>
	)
}

function ConnectButton() {
	return (
		<Link to="/connect">
			<button className="connect-btn">
				<h3>Connect</h3>
			</button>
		</Link>
	)
}

function ProfileButton() {
	const navigate = useNavigate()
	return (
		<button
			className="profile-btn"
			onClick={() => {
				navigateToUserProfile(navigate)
			}}
		>
			<h3>My Profile</h3>
		</button>
	)
}

function TournamentsButton() {
	return (
		<button className="tournament-btn">
			<h3>Tournaments</h3>
		</button>
	)
}

function ApplyButton() {
	const navigate = useNavigate()
	const accountData = getAccountDataFromSessionStorage()
	if (accountData === null) {
		navigate("/")
		return
	}

	return (
		<button
			onClick={() => navigate(`/apply/${accountData.id}`)}
			className="apply-btn"
		>
			<h3>Apply</h3>
		</button>
	)
}
