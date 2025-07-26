import { useContext, useState, useEffect, use } from "react"
import { useNavigate } from "react-router-dom"
import { ApplicationTileContext } from "./ApplicationTile"
import {
	BASEURL,
	TOKEN_SESSION_KEY,
	getAccountDataFromSessionStorage,
} from "../../utils/globalUtils"
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
	navigate(`/profiles/${profileInformation.accountId}`)
}

async function submitApplication(
	playerAccountId,
	teamAccountId,
	statusValue,
	setApplicationStatus
) {
	if (statusValue === DEFAULT_SELECT_VALUE) {
		return
	}

	const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
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

		const applicationData = await response.json()

		setApplicationStatus(applicationData.status)
		if (applicationData.status === AppicationStatusOptions.ACCEPTED) {
			viewProfile(applicationData.playerAccountId, navigate)
		}
	} catch (error) {
		console.error("Error trying to login:", error)
	}
}

export function ApplicationModal({teamAccountId}) {
	const navigate = useNavigate()
	const [statusValue, setStatusValue] = useState(DEFAULT_SELECT_VALUE)
	const {
		profileInformation,
		setIsApplicationModalOpen,
		applicationStatus,
		setApplicationStatus,
	} = useContext(ApplicationTileContext)

	useEffect(() => {
		if (
			profileInformation.rosterAccountIds.length > 0 ||
			applicationStatus != AppicationStatusOptions.PENDING
		) {
			viewProfile(profileInformation, navigate)
			return
		}
	}, [profileInformation, applicationStatus])

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
						<select
							name="yearsOfExperience"
							value={statusValue}
							onChange={handleInputChange}
						>
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
					<button
						className="submit-btn"
						onClick={() =>
							submitApplication(
								profileInformation.accountId,
								teamAccountId,
								statusValue,
                                setApplicationStatus
							)
						}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	)
}
