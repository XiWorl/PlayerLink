import "./Navbar.css"
import { AccountType } from "../../utils/globalUtils"
import { ACCOUNT_INFORMATION_KEY } from "../../utils/globalUtils"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
	return (
		<div className="navbar">
			<div className="navbar-contents">
				<div className="tournament">
					<TournamentButton />
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

function navigateToUserProfile(navigate) {
	const accountInformation = localStorage.getItem(ACCOUNT_INFORMATION_KEY)
	const parsedAccountInformation = accountInformation && JSON.parse(accountInformation)

	if (
		!parsedAccountInformation ||
		!parsedAccountInformation.id ||
		!parsedAccountInformation.accountType
	) {
		navigate("/")
		return
	}

	const navigationPath =
		parsedAccountInformation.accountType === AccountType.PLAYER ? "profiles" : "teams"
	navigate(`/${navigationPath}/${parsedAccountInformation.id}`)
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

function TournamentButton() {
	return (
		<button className="tournament-btn">
			<h3>Tournaments</h3>
		</button>
	)
}

function ApplyButton() {
	return (
		<button className="apply-btn">
			<h3>Apply</h3>
		</button>
	)
}
