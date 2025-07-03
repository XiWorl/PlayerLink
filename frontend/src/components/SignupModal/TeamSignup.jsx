import { TextFormField, LocationDropdown, YesOrNoDropdown } from "./utils"
import { useContext } from "react"
import { SignupModalContext } from "./SignupModal.jsx"
import { INVALID_INPUT_CLASS, VALID_INPUT_CLASS } from "./utils"

const MINUMUM_YEAR = "1900"

export default function TeamSignup() {
	const { formData, formErrors, handleInputChange, selectedAccountType } =
		useContext(SignupModalContext)
	return (
		<>
			<TextFormField
				accountType={selectedAccountType}
				title={"Team Name"}
				isRequired={true}
				elementName={"teamName"}
			/>

			<LocationDropdown accountType={selectedAccountType} />

			<YesOrNoDropdown
				accountType={selectedAccountType}
				title={"Currently Hiring"}
				elementName={"hiring"}
			/>

			<div className="form-group">
				<label>Year Established*</label>
				<input
					type="number"
					name="yearEstablished"
					value={formData.yearEstablished}
					onChange={handleInputChange}
					min={MINUMUM_YEAR}
					max={new Date().getFullYear()}
					className={
						formErrors[selectedAccountType].yearEstablished
							? INVALID_INPUT_CLASS
							: VALID_INPUT_CLASS
					}
				/>
			</div>
		</>
	)
}
