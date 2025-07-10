import { useContext } from "react"
import { ModalBodyContext } from "./ModalBody.jsx"
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
		useContext(ModalBodyContext)
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

export function Dropdown({
	title,
	elementName,
	options,
	defaultOptionText,
	optionValueTransform,
	optionDisplayTransform,
}) {
	const { formData, handleInputChange, formErrors, selectedAccountType } =
		useContext(ModalBodyContext)

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
				<option value={DEFAULT_FORM_VALUE}>{defaultOptionText}</option>
				{options.map((option) => {
					const value = optionValueTransform
						? optionValueTransform(option)
						: option
					const display = optionDisplayTransform
						? optionDisplayTransform(option)
						: option
					return (
						<option key={value} value={value}>
							{display}
						</option>
					)
				})}
			</select>
		</div>
	)
}

export function LocationDropdown() {
	return (
		<Dropdown
			title="Location"
			elementName="location"
			options={LocationOptions}
			defaultOptionText="Select your location"
		/>
	)
}

export function YesOrNoDropdown({ title, elementName }) {
	const yesNoOptions = [YesOrNoEnum.YES, YesOrNoEnum.NO]

	return (
		<Dropdown
			title={title}
			elementName={elementName}
			options={yesNoOptions}
			defaultOptionText="Select an option"
			optionDisplayTransform={(option) =>
				option === YesOrNoEnum.YES ? "Yes" : "No"
			}
		/>
	)
}

export function ExperienceDropdown() {
	const experienceOptions = Object.keys(YearsOfExperienceOptions)

	return (
		<Dropdown
			title="Years of Experience"
			elementName="yearsOfExperience"
			options={experienceOptions}
			defaultOptionText="Select experience level"
			optionValueTransform={(experience) => YearsOfExperienceOptions[experience]}
			optionDisplayTransform={(experience) =>
				`${YearsOfExperienceOptions[experience]} years`
			}
		/>
	)
}

export function GamesSelection({ title = "Gaming experience" }) {
	const {
		formData,
		handleGameSelection,
		handleUsernameChange,
		formErrors,
		selectedAccountType,
	} = useContext(ModalBodyContext)

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

export function PlaystyleSelection() {
	const { formData, handlePlaystyleSelection, formErrors, selectedAccountType } =
		useContext(ModalBodyContext)

	const currentPlaystyles = formData[selectedAccountType].desiredPlaystyle

	return (
		<div className="form-group">
			<label>Desired playstyle* (Select all that apply)</label>
			<div className="games-selection-list">
				{Object.keys(PlaystyleOptions).map((playstyle) => (
					<div
						key={PlaystyleOptions[playstyle]}
						className="game-selection-container"
					>
						<div className="game-checkbox-label">
							<h3>{PlaystyleOptions[playstyle]}</h3>
							<input
								type="checkbox"
								checked={currentPlaystyles.includes(
									PlaystyleOptions[playstyle]
								)}
								onChange={() =>
									handlePlaystyleSelection(PlaystyleOptions[playstyle])
								}
								className="game-checkbox"
							/>
						</div>
					</div>
				))}
			</div>
			{formErrors[selectedAccountType]?.desiredPlaystyle && (
				<span className="form-error-message">
					{formErrors[selectedAccountType].desiredPlaystyle}
				</span>
			)}
		</div>
	)
}

export function DesiredSkillLevelDropdown() {
	const skillLevelOptions = ["High", "Medium", "Low"]

	return (
		<Dropdown
			title="Desired Skill Level"
			elementName="desiredSkillLevel"
			options={skillLevelOptions}
			defaultOptionText="Select desired skill level"
			optionValueTransform={(level) => level.toLowerCase()}
		/>
	)
}

export function PlayStyleDropdown() {
	const skillLevelOptions = ["High", "Medium", "Low"]

	return (
		<Dropdown
			title="Preferred Playstyle"
			elementName="playstyle"
			options={skillLevelOptions}
			defaultOptionText="Select preferred playstyle"
			optionValueTransform={(level) => level.toLowerCase()}
		/>
	)
}
