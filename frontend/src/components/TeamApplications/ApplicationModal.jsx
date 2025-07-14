import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ApplicationTileContext } from "./ApplicationTile"
import "../SignupModal/SignupModal.css"

const AppicationStatusOptions = {
	PENDING: "Pending",
	ACCEPTED: "Accepted",
	REJECTED: "Rejected",
}

function closeModal(setIsApplicationModalOpen) {
	setIsApplicationModalOpen(false)
}

function viewProfile(profileInformation, navigate) {
	navigate(`/profile/${profileInformation.id}`)
}

export function ApplicationModal() {
	const navigate = useNavigate()
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
							<option value={AppicationStatusOptions.PENDING}>
								Pending
							</option>
							<option value={AppicationStatusOptions.ACCEPTED}>
								Accepted
							</option>
							<option value={AppicationStatusOptions.REJECTED}>
								Rejected
							</option>
						</select>
					</div>
				</form>
				<div className="modal-buttons">
					<button
						className="cancel-btn"
						onClick={() => viewProfile(profileInformation, navigate)}
					>
						Cancel
					</button>
					<button
						className="cancel-btn"
						onClick={() => closeModal(setIsApplicationModalOpen)}
					>
						View Account
					</button>
					<button className="submit-btn">Submit</button>
				</div>
			</div>
		</div>
	)
}
