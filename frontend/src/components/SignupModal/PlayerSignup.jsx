import { TextFormField, LocationDropdown, YesOrNoDropdown } from "./utils"
import { useContext } from "react"
import { SignupModalContext } from "./SignupModal.jsx"
import { YearsOfExperienceOptions } from "./utils"

const INVALID_INPUT_CLASS = "error"
const VALID_INPUT_CLASS = ""

export default function PlayerSignup() {
	const { formData, formErrors, handleInputChange, selectedAccountType } =
		useContext(SignupModalContext)
	return (
		<>
			<TextFormField
				accountType={selectedAccountType}
				title={"First Name"}
				isRequired={true}
				elementName={"firstName"}
			/>

			<TextFormField
				accountType={selectedAccountType}
				title={"Last Name"}
				isRequired={false}
				elementName={"lastName"}
			/>

			<LocationDropdown accountType={selectedAccountType} />

			<YesOrNoDropdown
				accountType={selectedAccountType}
				title={"Willing To Relocate"}
				elementName={"willingToRelocate"}
			/>

			<div className="form-group">
				<label>Years of Experience*</label>
				<select
					name="yearsOfExperience"
					value={formData.yearsOfExperience}
					onChange={handleInputChange}
					className={
						formErrors[selectedAccountType].yearsOfExperience
							? INVALID_INPUT_CLASS
							: VALID_INPUT_CLASS
					}
				>
					<option value="">Select experience</option>
					<option value={YearsOfExperienceOptions["ZERO_TO_ONE"]}>
						0-1 years
					</option>
					<option value={YearsOfExperienceOptions["TWO_TO_THREE"]}>
						2-3 years
					</option>
					<option value={YearsOfExperienceOptions["FOUR_TO_FIVE"]}>
						4-5 years
					</option>
					<option value={YearsOfExperienceOptions["SIX_TO_TEN"]}>
						6-10 years
					</option>
					<option value={YearsOfExperienceOptions["TENPLUS"]}>10+ years</option>
				</select>
			</div>
		</>
	)
}
