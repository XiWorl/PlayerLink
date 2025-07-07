import Navbar from "../components/Navbar/Navbar"
import "../components/TeamApplication/ApplyPage.css"

export default function ViewAccountsPage() {
    //TODO: Two posts are currently hardcoded for visual and testing purposes, a future commit will replace these with data from the backend
    //TODO: This page isn't currently utilized but will be used in a future commit to allow users to apply to teams
    return (
        <>
            <Navbar />
            <div className="apply-page">
                <div className="header">
                    <div className="view-players">
                        <button className="view-players-btn">View Players</button>
                    </div>
                    <div className="view-teams">
                        <button className="view-teams-btn">View Teams</button>
                    </div>
                </div>
                <div className="page-content">
                    <div className="sidebar">
                        <div className="sidebar-options">
                            <button className="sidebar-options-btn">
                                View Applications
                            </button>
                        </div>
                    </div>
                    <div className="postings">
                        <div className="post">
                            <div className="apply-profile-picture"></div>
                            <div className="apply-details">
                                <h2>Job title</h2>
                                <div className="post-information">
                                    <h3>Team name * location</h3>
                                    <button>Apply</button>
                                </div>
                            </div>
                        </div>
                        <div className="post">
                            <div className="apply-profile-picture"></div>
                            <div className="apply-details">
                                <h2>Job title</h2>
                                <div className="post-information">
                                    <h3>Team name * location</h3>
                                    <button>Apply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
