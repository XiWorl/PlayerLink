import { getAccountDataFromSessionStorage, AccountType } from "../../utils/globalUtils"
import { useState, useEffect, createContext, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"

export const NavbarContext = createContext()

export default function Navbar() {
	const navigate = useNavigate()
	const [accountData, setAccountData] = useState(null)

	useEffect(() => {
		const accountData = getAccountDataFromSessionStorage()
		if (accountData === null) {
			navigate("/")
			return
		}
		setAccountData(accountData)
	}, [])

	return (
		<NavbarContext.Provider value={{ accountData, navigate }}>
			<div className="navbar">
				<div className="navbar-contents">
					<div className="logo">
						<h2 className="logo-text">PlayerLink</h2>
					</div>
					<div className="nav-items">
						<div className="tournament">
							<TournamentsButton />
						</div>
						<div className="apply">
							<ApplicationsButton />
						</div>
						<div className="connect">
							<ConnectButton />
						</div>
						<div className="profile">
							<ProfileButton />
						</div>
					</div>
				</div>
			</div>
		</NavbarContext.Provider>
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
	const { accountData, navigate } = useContext(NavbarContext)
	if (accountData === null) return

	const navigationPath =
		accountData.accountType === AccountType.PLAYER ? "profiles" : "teams"

	return (
		<button
			className="profile-btn"
			onClick={() => {
				navigate(`/${navigationPath}/${accountData.id}`)
			}}
		>
			<h3>My Profile</h3>
		</button>
	)
}

function TournamentsButton() {
	return (
		<Link to="/tournaments">
			<button className="tournament-navbar">
				<h3>Tournaments</h3>
			</button>
		</Link>
	)
}

function ApplicationsButton() {
	const { accountData, navigate } = useContext(NavbarContext)
	if (accountData === null) return

	return (
		<button
			onClick={() => navigate(`/apply/${accountData.id}`)}
			className="apply-btn"
		>
			<h3>Applications</h3>
		</button>
	)
}
