

export default function ApplyPage() {
    return (
        <>
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
                        <button className="sidebar-options-btn">View Applications</button>
                        <button className="sidebar-options-btn">Applications</button>
                        <button className="sidebar-options-btn">Create application</button>
                    </div>
                </div>
                <div className="postings"></div>
            </div>
        </>
    )
}
