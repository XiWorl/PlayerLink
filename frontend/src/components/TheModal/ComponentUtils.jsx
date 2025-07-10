import { useContext } from "react"
import { UserInfoModalContext } from "./ModalBody.jsx"

export const INVALID_INPUT_CLASS = "error"
export const VALID_INPUT_CLASS = ""
export const DEFAULT_FORM_VALUE = ""
export const DEFAULT_ERRORS_VALUE = Object.freeze({})

const LOCATION_OPTIONS = ["USA", "Asia", "Mexico", "Canada", "Europe"]
const EXPERIENCE_OPTIONS = ["0-1", "1-2", "2-3"]
const PLAY_STYLE_OPTIONS = ["support", "strategist", "main"]
const GAME_OPTIONS = ["Valorant", "League Of Legends", "Apex Legends", "CS:GO"]
const GAME_PLACEHOLDER = {}
const YesOrNoEnum = Object.freeze({
	YES: "yes",
	NO: "no",
})

export function TextFormField({ title, isRequired, elementName, placeholder }) {
	const { formData, handleInputChange, formErrors } = useContext(UserInfoModalContext)
	let displayTitle = title
	let className = VALID_INPUT_CLASS

	if (isRequired) {
		displayTitle = title + " *"
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
			<label htmlFor="location">Location *</label>
			<select
				id="location"
				name="location"
				value={formData.location}
				onChange={handleInputChange}
				className={formErrors.location ? INVALID_INPUT_CLASS : VALID_INPUT_CLASS}
			>
				<option value="">Select your location</option>
				{LOCATION_OPTIONS.map((location) => (
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
			<label htmlFor={elementName}>{title} *</label>
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
			<label htmlFor="yearsOfExperience">Years of Experience *</label>
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
				{EXPERIENCE_OPTIONS.map((exp) => (
					<option key={exp} value={exp}>
						{exp} years
					</option>
				))}
			</select>
		</div>
	)
}

export function PlayStyleDropdown() {
	const { formData, handleInputChange, formErrors } = useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label htmlFor="playStyle">Play Style *</label>
			<select
				id="playStyle"
				name="playStyle"
				value={formData.playStyle}
				onChange={handleInputChange}
				className={formErrors.playStyle ? INVALID_INPUT_CLASS : VALID_INPUT_CLASS}
			>
				<option value="">Select your play style</option>
				{PLAY_STYLE_OPTIONS.map((style) => (
					<option key={style} value={style}>
						{style.charAt(0).toUpperCase() + style.slice(1)}
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
			<label>Games Played * (Select all that apply)</label>
			<div className="games-selection-list">
				{GAME_OPTIONS.map((game) => (
					<div key={game} className="game-selection-container">
						<div className="game-checkbox-label">
							<h3>{game}</h3>
							<input
								type="checkbox"
								checked={formData.gamesPlayed.includes(game)}
								onChange={() => handleGameSelection(game)}
								className="game-checkbox"
							/>
							{/* {game} */}
						</div>
						{formData.gamesPlayed.includes(game) && (
							<div className="username-input-container">
								<input
									type="text"
									placeholder={`Enter your ${game} username`}
									value={formData.gameUsernames[game] || ""}
									onChange={(e) =>
										handleUsernameChange(game, e.target.value)
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
