import "./Navbar.css"
import { AccountType, getAccountDataFromLocalStorage } from "../../utils/globalUtils"
import { ACCOUNT_INFORMATION_KEY } from "../../utils/globalUtils"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
	const navigate = useNavigate()
	return (
		<div className="navbar">
			<div className="navbar-contents">
				<div className="tournament">
					<TournamentsButton />
				</div>
				<div className="applications">
					<ApplicationsButton />
				</div>
				<div className="connect">
					<ConnectButton />
				</div>
				<div className="profile">
					<ProfileButton navigate={navigate} />
				</div>
			</div>
		</div>
	)
}

function navigateToUserProfile(navigate) {
	const accountData = getAccountDataFromLocalStorage()
	if (accountData === null) {
		navigate("/")
		return
	}

	const navigationPath =
		accountData.accountType === AccountType.PLAYER ? "profiles" : "teams"
	navigate(`/${navigationPath}/${accountData.id}`)
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

function ProfileButton({ navigate }) {
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

function ApplicationsButton() {
	return (
		<button className="apply-btn">
			<h3>Applications</h3>
		</button>
	)
}
