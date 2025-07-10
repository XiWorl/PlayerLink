import { useContext } from "react"
import { UserInfoModalContext } from "./ModalBody.jsx"
import {
	LocationOptions,
	YearsOfExperienceOptions,
	GameOptions,
	PlaystyleOptions,
} from "../../utils/globalUtils.js"

export const INVALID_INPUT_CLASS = "error"
export const VALID_INPUT_CLASS = ""
export const DEFAULT_FORM_VALUE = ""
export const DEFAULT_ERRORS_VALUE = Object.freeze({ player: {}, team: {} })
const Placeholders = {
	VALORANT: "Valorant username and tagline (username#tagline)",
	FORTNITE: "Fortnite Epic Games username",
	APEX_LEGENDS: "Apex Legends Origin username",
}
const YesOrNoEnum = Object.freeze({
	YES: "yes",
	NO: "no",
})

export function TextFormField({ title, isRequired, elementName, placeholder }) {
	const { formData, handleInputChange, formErrors, selectedAccountType } =
		useContext(UserInfoModalContext)
	let displayTitle = title
	let className = VALID_INPUT_CLASS

	if (isRequired) {
		displayTitle = title + "*"
		className = formErrors[selectedAccountType]?.[elementName]
			? INVALID_INPUT_CLASS
			: VALID_INPUT_CLASS
	}

	return (
		<div className="form-group">
			<label>{displayTitle}</label>
			<input
				type="text"
				name={elementName}
				value={formData[selectedAccountType][elementName]}
				onChange={handleInputChange}
				className={className}
				placeholder={placeholder}
			/>
		</div>
	)
}

export function LocationDropdown() {
	const { formData, handleInputChange, formErrors, selectedAccountType } =
		useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label>Location*</label>
			<select
				name="location"
				value={formData[selectedAccountType].location}
				onChange={handleInputChange}
				className={
					formErrors[selectedAccountType]?.location
						? INVALID_INPUT_CLASS
						: VALID_INPUT_CLASS
				}
			>
				<option value={DEFAULT_FORM_VALUE}>Select your location</option>
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
	const { formData, handleInputChange, formErrors, selectedAccountType } =
		useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label>{title}*</label>
			<select
				name={elementName}
				value={formData[selectedAccountType][elementName]}
				onChange={handleInputChange}
				className={
					formErrors[selectedAccountType]?.[elementName]
						? INVALID_INPUT_CLASS
						: VALID_INPUT_CLASS
				}
			>
				<option value={DEFAULT_FORM_VALUE}>Select an option</option>
				<option value={YesOrNoEnum.YES}>Yes</option>
				<option value={YesOrNoEnum.NO}>No</option>
			</select>
		</div>
	)
}

export function ExperienceDropdown() {
	const { formData, handleInputChange, formErrors, selectedAccountType } =
		useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label>Years of Experience*</label>
			<select
				name="yearsOfExperience"
				value={formData[selectedAccountType].yearsOfExperience}
				onChange={handleInputChange}
				className={
					formErrors[selectedAccountType]?.yearsOfExperience
						? INVALID_INPUT_CLASS
						: VALID_INPUT_CLASS
				}
			>
				<option value={DEFAULT_FORM_VALUE}>Select experience level</option>
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

export function PlayStyleDropdown({
	title = "Preferred Playstyle",
	elementName = "playStyle",
}) {
	const { formData, handleInputChange, formErrors, selectedAccountType } =
		useContext(UserInfoModalContext)

	return (
		<div className="form-group">
			<label>{title}*</label>
			<select
				name={elementName}
				value={formData[selectedAccountType][elementName]}
				onChange={handleInputChange}
				className={
					formErrors[selectedAccountType]?.[elementName]
						? INVALID_INPUT_CLASS
						: VALID_INPUT_CLASS
				}
			>
				<option value={DEFAULT_FORM_VALUE}>Select your playstyle</option>
				{Object.keys(PlaystyleOptions).map((playstyle) => (
					<option
						key={PlaystyleOptions[playstyle]}
						value={PlaystyleOptions[playstyle]}
					>
						{PlaystyleOptions[playstyle]}
					</option>
				))}
			</select>
		</div>
	)
}

export function GamesSelection({ title = "Gaming experience" }) {
	const {
		formData,
		handleGameSelection,
		handleUsernameChange,
		formErrors,
		selectedAccountType,
	} = useContext(UserInfoModalContext)

	const gamesField = selectedAccountType === "team" ? "supportedGames" : "gamesPlayed"
	const currentGames = formData[selectedAccountType][gamesField]
	const showUsernames = selectedAccountType === "player"

	return (
		<div className="form-group">
			<label>{title}* (Select all that apply)</label>
			<div className="games-selection-list">
				{Object.keys(GameOptions).map((game) => (
					<div key={GameOptions[game]} className="game-selection-container">
						<div className="game-checkbox-label">
							<h3>{GameOptions[game]}</h3>
							<input
								type="checkbox"
								checked={currentGames.includes(GameOptions[game])}
								onChange={() => handleGameSelection(GameOptions[game])}
								className="game-checkbox"
							/>
						</div>
						{showUsernames && currentGames.includes(GameOptions[game]) && (
							<div className="username-input-container">
								<input
									type="text"
									placeholder={
										Placeholders[game] ||
										`Enter your ${GameOptions[game]} username`
									}
									value={
										formData[selectedAccountType].gameUsernames[
											GameOptions[game]
										] || DEFAULT_FORM_VALUE
									}
									onChange={(event) =>
										handleUsernameChange(
											GameOptions[game],
											event.target.value
										)
									}
									className="game-username-input"
								/>
							</div>
						)}
					</div>
				))}
			</div>
			{formErrors[selectedAccountType]?.[gamesField] && (
				<span className="form-error-message">
					{formErrors[selectedAccountType][gamesField]}
				</span>
			)}
		</div>
	)
}

export function DesiredSkillLevelDropdown() {
	const { formData, handleInputChange, formErrors, selectedAccountType } =
		useContext(UserInfoModalContext)

	const skillLevelOptions = ["High", "Medium", "Low"]

	return (
		<div className="form-group">
			<label>Desired Skill Level*</label>
			<select
				name="desiredSkillLevel"
				value={formData[selectedAccountType].desiredSkillLevel}
				onChange={handleInputChange}
				className={
					formErrors[selectedAccountType]?.desiredSkillLevel
						? INVALID_INPUT_CLASS
						: VALID_INPUT_CLASS
				}
			>
				<option value={DEFAULT_FORM_VALUE}>Select desired skill level</option>
				{skillLevelOptions.map((level) => (
					<option key={level} value={level.toLowerCase()}>
						{level}
					</option>
				))}
			</select>
		</div>
	)
}
