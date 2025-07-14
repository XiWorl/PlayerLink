import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ApplicationTileContext } from "./ApplicationTile"
import { BASEURL, TOKEN_STORAGE_KEY, getAccountDataFromSessionStorage } from "../../utils/globalUtils"
import "../SignupModal/SignupModal.css"

const DEFAULT_SELECT_VALUE = ""
const AppicationStatusOptions = {
	PENDING: "pending",
	ACCEPTED: "accepted",
	REJECTED: "rejected",
}

function closeModal(setIsApplicationModalOpen) {
	setIsApplicationModalOpen(false)
}

function viewProfile(profileInformation, navigate) {
	navigate(`/profiles/${profileInformation.playerId}`)
}

async function submitApplication(playerAccountId, teamAccountId, statusValue) {
	if (statusValue === DEFAULT_SELECT_VALUE) {
		return
	}
	console.log("submitting application", playerAccountId, teamAccountId, statusValue)
	const token = sessionStorage.getItem(TOKEN_STORAGE_KEY)
	try {
		const response = await fetch(`${BASEURL}/applications/status/update`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				playerAccountId: playerAccountId,
				teamAccountId: teamAccountId,
				status: statusValue,
			}),
		})
		const data = await response.json()
		console.log(response, data)
	} catch (error) {
		console.error("Error trying to login:", error)
	}
}

export function ApplicationModal() {
	const [statusValue, setStatusValue] = useState(DEFAULT_SELECT_VALUE)
	const navigate = useNavigate()
	const { profileInformation, setIsApplicationModalOpen } =
	useContext(ApplicationTileContext)
	const teamAccountId = getAccountDataFromSessionStorage().id

	function handleInputChange(event) {
		setStatusValue(event.target.value)
	}

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
						<select name="yearsOfExperience" value={statusValue} onChange={handleInputChange}>
							<option value={DEFAULT_SELECT_VALUE}>Select Status</option>
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
						onClick={() => closeModal(setIsApplicationModalOpen)}
					>
						Cancel
					</button>
					<button
						className="cancel-btn"
						onClick={() => viewProfile(profileInformation, navigate)}
					>
						View Account
					</button>
					<button className="submit-btn" onClick={()=>submitApplication(profileInformation.playerId, teamAccountId, statusValue)}>Submit</button>
				</div>
			</div>
		</div>
	)
}
