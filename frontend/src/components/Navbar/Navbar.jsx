import "./Navbar.css"
export default function Navbar() {
	return (
		<div className="navbar">
			<div className="navbar-contents">
				<div className="tournament">
					<Tournament />
				</div>
				<div className="teams">
					<Teams />
				</div>
				<div className="profile">
					<ProfileIcon />
				</div>
			</div>
		</div>
	)
}

function Teams() {
	return (
		<button className="teams-button">
			<h3>Connect</h3>
		</button>
	)
}

function ProfileIcon() {
	return (
		<button className="profile-button">
			<h3>My Profile</h3>
		</button>
	)
}

function Tournament() {
	return (
		<button className="tournament-button">
			<h3>Tournaments</h3>
		</button>
	)
}
