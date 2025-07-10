import { useContext } from "react"
import { UserInfoModalContext } from "./ModalBody.jsx"
import { LocationOptions, YearsOfExperienceOptions, GameOptions, PlaystyleOptions } from "../../utils/globalUtils.js"

export const INVALID_INPUT_CLASS = "error"
export const VALID_INPUT_CLASS = ""
export const DEFAULT_FORM_VALUE = ""
export const DEFAULT_ERRORS_VALUE = Object.freeze({})
const Placeholders = {
	VALORANT: "Valorant username and tagline (username#tagline)",
	FORTNITE: "Fortnite Epic Games username",
	APEX_LEGENDS: "Apex Legends Origin username",
}
const PLAY_STYLE_OPTIONS = ["tactical", "supportive", "aggressive", "defensive", "adaptable"]
const YesOrNoEnum = Object.freeze({
	YES: "yes",
	NO: "no",
})

export function TextFormField({ title, isRequired, elementName, placeholder }) {
	const { formData, handleInputChange, formErrors } = useContext(UserInfoModalContext)
	let displayTitle = title
	let className = VALID_INPUT_CLASS

	if (isRequired) {
		displayTitle = title + "*"
		className = formErrors[elementName] ? INVALID_INPUT_CLASS : VALID_INPUT_CLASS
	}

	return (
		<div className="form-group">
			<label htmlFor={elementName}>{displayTitle}</label>
			<input
				type="text"
				id={elementName}
				name={elementName}
				value={formData[elementName]}
				onChange={handleInputChange}
				className={className}
				placeholder={placeholder}
			/>
		</div>
	)
}

export function LocationDropdown() {
	const { formData, handleInputChange, formErrors } = useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label htmlFor="location">Location*</label>
			<select
				id="location"
				name="location"
				value={formData.location}
				onChange={handleInputChange}
				className={formErrors.location ? INVALID_INPUT_CLASS : VALID_INPUT_CLASS}
			>
				<option value="">Select your location</option>
				{LocationOptions.map((location) => (
					<option key={location} value={location}>
						{location}
					</option>
				))}
			</select>
		</div>
	)
}

export function YesOrNoDropdown({ title, elementName }) {
	const { formData, handleInputChange, formErrors } = useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label htmlFor={elementName}>{title}*</label>
			<select
				id={elementName}
				name={elementName}
				value={formData[elementName]}
				onChange={handleInputChange}
				className={
					formErrors[elementName] ? INVALID_INPUT_CLASS : VALID_INPUT_CLASS
				}
			>
				<option value="">Select an option</option>
				<option value={YesOrNoEnum.YES}>Yes</option>
				<option value={YesOrNoEnum.NO}>No</option>
			</select>
		</div>
	)
}

export function ExperienceDropdown() {
	const { formData, handleInputChange, formErrors } = useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label htmlFor="yearsOfExperience">Years of Experience*</label>
			<select
				id="yearsOfExperience"
				name="yearsOfExperience"
				value={formData.yearsOfExperience}
				onChange={handleInputChange}
				className={
					formErrors.yearsOfExperience ? INVALID_INPUT_CLASS : VALID_INPUT_CLASS
				}
			>
				<option value="">Select experience level</option>
				{Object.keys(YearsOfExperienceOptions).map((experience) => {
					return (
						<option
							key={YearsOfExperienceOptions[experience]}
							value={YearsOfExperienceOptions[experience]}
						>
							{YearsOfExperienceOptions[experience]} years
						</option>
					)
				})}
			</select>
		</div>
	)
}

export function PlayStyleDropdown() {
	const { formData, handleInputChange, formErrors } = useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label htmlFor="playStyle">Preferred Playstyle*</label>
			<select
				id="playStyle"
				name="playStyle"
				value={formData.playStyle}
				onChange={handleInputChange}
				className={formErrors.playStyle ? INVALID_INPUT_CLASS : VALID_INPUT_CLASS}
			>
				<option value="">Select your playstyle</option>
				{Object.keys(PlaystyleOptions).map((playstyle) => (
					<option key={PlaystyleOptions[playstyle]} value={PlaystyleOptions[playstyle]}>
						{PlaystyleOptions[playstyle]}
					</option>
				))}
			</select>
		</div>
	)
}

export function GamesSelection() {
	const { formData, handleGameSelection, handleUsernameChange, formErrors } =
		useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label>Gaming experience* (Select all that apply)</label>
			<div className="games-selection-list">
				{Object.keys(GameOptions).map((game) => (
					<div key={GameOptions[game]} className="game-selection-container">
						<div className="game-checkbox-label">
							<h3>{GameOptions[game]}</h3>
							<input
								type="checkbox"
								checked={formData.gamesPlayed.includes(GameOptions[game])}
								onChange={() => handleGameSelection(GameOptions[game])}
								className="game-checkbox"
							/>
						</div>
						{formData.gamesPlayed.includes(GameOptions[game]) && (
							<div className="username-input-container">
								<input
									type="text"
									placeholder={Placeholders[game]}
									value={formData.gameUsernames[GameOptions[game]] || ""}
									onChange={(e) =>
										handleUsernameChange(GameOptions[game], e.target.value)
									}
									className="game-username-input"
								/>
							</div>
						)}
					</div>
				))}
			</div>
			{formErrors.gamesPlayed && (
				<span className="form-error-message">{formErrors.gamesPlayed}</span>
			)}
		</div>
	)
}
