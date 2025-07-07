import Navbar from "../components/Navbar/Navbar"
import "../components/TeamApplication/ViewAccounts.css"

export default function ViewAccountsPage() {
    //TODO: Two accounts are currently hardcoded for visual and testing purposes, a future commit will replace these with data from the backend
	return (
		<>
			<Navbar />
			<div className="view-page">
				<div className="header">
					<div className="view-players">
						<button className="view-players-btn">View Players</button>
					</div>
					<div className="view-teams">
						<button className="view-teams-btn">View Teams</button>
					</div>
				</div>
				<div className="page-content">
					<div className="accounts">
						<div className="account">
							<div className="view-profile-picture"></div>
							<div className="view-details">
								<h2>Team Name</h2>
								<div className="account-information">
									<h3>Team description * location</h3>
									<div className="account-information-hiring">
										<div className="hiring-icon"></div>
										<h4>Hiring</h4>
									</div>
								</div>
							</div>
						</div>
						<div className="account">
							<div className="view-profile-picture"></div>
							<div className="view-details">
								<h2>Team Name</h2>
								<div className="account-information">
									<h3>Team description * location</h3>
									<div className="account-information-hiring">
										<div className="hiring-icon"></div>
										<h4>Hiring</h4>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
