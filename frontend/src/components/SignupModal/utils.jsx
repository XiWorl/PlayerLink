import { useContext } from "react"
import { SignupModalContext } from "./SignupModal.jsx"
import { LOCATION_OPTIONS } from "../../utils/globalUtils.js"

export const INVALID_INPUT_CLASS = "error"
export const VALID_INPUT_CLASS = ""
export const DEFAULT_ERRORS_VALUE = Object.freeze({ player: {}, team: {} })
export const DEFAULT_FORM_VALUE = ""

const YesOrNoEnum = Object.freeze({
	YES: "Yes",
	NO: "No",
})

export function TextFormField({ accountType, title, isRequired, elementName }) {
	const { formData, handleInputChange, formErrors } = useContext(SignupModalContext)
	let className = ""
	if (isRequired) {
		title = title + "*"
		className = formErrors[accountType][elementName]
			? INVALID_INPUT_CLASS
			: VALID_INPUT_CLASS
	}

	return (
		<div className="form-group">
			<label>{title}</label>
			<input
				type="text"
				name={elementName}
				value={formData[accountType][elementName]}
				onChange={handleInputChange}
				className={className}
			/>
		</div>
	)
}

export function LocationDropdown({ accountType }) {
	const { formData, handleInputChange, formErrors } = useContext(SignupModalContext)
	return (
		<div className="form-group">
			<label>Location*</label>
			<select
				name="location"
				value={formData[accountType].location}
				onChange={handleInputChange}
				className={
					formErrors[accountType].location
						? INVALID_INPUT_CLASS
						: VALID_INPUT_CLASS
				}
			>
				<option value="">Select location</option>
				{LOCATION_OPTIONS.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	)
}

export function YesOrNoDropdown({ accountType, title, elementName }) {
	const { formData, handleInputChange, formErrors } = useContext(SignupModalContext)

	return (
		<div className="form-group">
			<label>{title}*</label>
			<select
				name={elementName}
				value={formData[elementName]}
				onChange={handleInputChange}
				className={
					formErrors[accountType][elementName]
						? INVALID_INPUT_CLASS
						: VALID_INPUT_CLASS
				}
			>
				<option value="">Select option</option>
				<option value={YesOrNoEnum.YES}>Yes</option>
				<option value={YesOrNoEnum.NO}>No</option>
			</select>
		</div>
	)
}
