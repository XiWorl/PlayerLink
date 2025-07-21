import "./LoadingScreen.css"

export function LoadingScreen({ message = "Loading your Experience..." }) {
	return (
		<div className="loading-screen">
			<div className="loading-content">
				<img
					src="/PlayerLink logo1.png"
					alt="PlayerLink Logo"
					className="loading-logo"
				/>
				<h2 className="loading-text">{message}</h2>
				<div className="loading-spinner"></div>
			</div>
		</div>
	)
}

export default LoadingScreen
