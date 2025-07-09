import { AccountType } from "../../utils/globalUtils"
import { CustomizableModal, ModalHeader } from "../CustomizableModal/CustomizableModal"
import { ModalTextBox } from "../CustomizableModal/utils"
import { modalSubmitHelper } from "./EditButtonUtils"
import { useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { UserProfileContext } from "./UserProfile"
export const TypeOfEditButton = {
	BIO: "bio",
	ABOUT: "about",
}

export function EditProfileButton() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const modalTitle = "Edit your profile"

	return (
		<>
			<input
				type="image"
				src="/pen-to-square.png"
				className="profile-about-image"
				onClick={() => setIsModalOpen(!isModalOpen)}
			/>

			<div className="signup-modal-overlay">
				<div className="signup-modal-content">
					<div className="signup-modal-header">
						<h2>Edit your profile</h2>
						<button
							className="close-button"
							onClick={() => setIsModalOpen(false)}
						>
							&times;
						</button>
					</div>
					<form class="signup-form">
						<div className="modal-text">
							<textarea className="modal-text-box"></textarea>
						</div>
						<div className="form-group">
							<label>Years of Experience*</label>
							<select name="yearsOfExperience">
								<option value="">Select experience</option>
								<option value="ss">0-1 years</option>
								<option value="ss">2-3 years</option>
								<option value="ss">4-5 years</option>
								<option value="ss">6-10 years</option>
								<option value="ss">10+ years</option>
							</select>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}
