import { useContext } from "react"
import { ApplicationTileContext } from "./ApplicationTile"
import "../SignupModal/SignupModal.css"

export function ApplicationModal() {
	const { profileInformation, setIsApplicationModalOpen } =
		useContext(ApplicationTileContext)

	return (
		<div className="signup-modal-overlay">
			<div className="signup-modal-content">
				<div className="signup-modal-header">
					<h2>{`Review ${profileInformation.firstName}'s Application`}</h2>
					<button
						className="close-button"
						onClick={() => setIsApplicationModalOpen(false)}
					>
						&times;
					</button>
				</div>
				<form className="signup-form">
					<div className="form-group">
						<label>Application Status</label>
						<select name="yearsOfExperience">
							<option value="">Select Status</option>
							<option value="ss">Pending</option>
							<option value="ss">Accepted</option>
							<option value="ss">Rejected</option>
						</select>
					</div>
				</form>
				<div className="modal-buttons">
					<button className="cancel-btn">Cancel</button>
					<button className="cancel-btn">View Account</button>
					<button className="submit-btn">Submit</button>
				</div>
			</div>
		</div>
	)
}
