import { useState, createContext } from "react"
import { AccountType } from "../../utils/globalUtils"
import "../SignupModal/SignupModal.css"

export const EditModalContext = createContext()

export function TextFormField({ accountType, title, isRequired, elementName }) {
	return (
		<div className="form-group">
			<label>{title}</label>
			<input type="text" name={elementName} className="" />
		</div>
	)
}

export default function EditModal() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	return (
		<EditModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
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
					<TextFormField
						accountType={AccountType.TEAM}
						title="First Name"
						isRequired={true}
						elementName="firstName"
					/>
					<TextFormField
						accountType={AccountType.TEAM}
						title="Last Name"
						isRequired={true}
						elementName="firstName"
					/>
					<TextFormField
						accountType={AccountType.TEAM}
						title="Last Name"
						isRequired={true}
						elementName="firstName"
					/>
				</div>
			</div>
		</EditModalContext.Provider>
	)
}
