import { TextFormField, LocationDropdown, YesOrNoDropdown } from "./utils"
import { useContext } from "react"
import { SignupModalContext } from "./SignupModal.jsx"

const INVALID_INPUT_CLASS = "error"
const VALID_INPUT_CLASS = ""
const YearsOfExperienceOptions = Object.freeze({
	"0-1": "0-1",
	"2-3": "2-3",
	"4-5": "4-5",
	"6-10": "6-10",
	"10+": "10+",
})

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
					<option value={YearsOfExperienceOptions[""]}>0-1 years</option>
					<option value={YearsOfExperienceOptions["2-3"]}>2-3 years</option>
					<option value={YearsOfExperienceOptions["4-5"]}>4-5 years</option>
					<option value={YearsOfExperienceOptions["6-10"]}>6-10 years</option>
					<option value={YearsOfExperienceOptions["10+"]}>10+ years</option>
				</select>
			</div>
		</>
	)
}
