function GameInformation({ accountData }) {
    console.log(accountData)
	return (
		<div className="profile-gaming-game">
			<img src="#" className="profile-gaming-icon" />
			<div className="profile-gaming-information">
				<h4>Game Name</h4>
				<div className="profile-gaming-performance">
					<p>Performance1</p>
					<p>Performance2</p>
					<p>Performance3</p>
					<p>Performance4</p>
				</div>
			</div>
		</div>
	)
}

export default function GamingExperience({ accountData }) {
	return (
		<div className="profile-gaming-container">
			<div className="profile-gaming-game">
				<img src="#" className="profile-gaming-icon" />
				<div className="profile-gaming-information">
					<h4>Game Name</h4>
					<div className="profile-gaming-performance">
						<p>Performance1</p>
						<p>Performance2</p>
						<p>Performance3</p>
						<p>Performance4</p>
					</div>
				</div>
			</div>
		</div>
	)
}
