import { useContext } from "react"
import { ModalBodyContext } from "./ModalBody.jsx"
import { AccountType } from "../../utils/globalUtils.js"
import {
	LocationOptions,
	YearsOfExperienceOptions,
	GameOptions,
	PlaystyleOptions,
	SkillLevelOptions,
} from "../../utils/globalUtils.js"
import {
	handlePlaystyleSelectionLogic,
	handleUsernameChangeLogic,
	handleGameSelectionLogic,
	updateFormState,
	VALID_INPUT_CLASS,
	DEFAULT_FORM_VALUE,
	SUPPORTED_GAMES_FIELD,
	GAMING_EXPERIENCE_FIELD,
} from "./UserInputUtils.jsx"

const INVALID_INPUT_CLASS = "error"

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
	const { formData, formErrors, selectedAccountType, setFormData, setFormErrors } =
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
				onChange={(event) =>
					updateFormState(
						event,
						setFormData,
						setFormErrors,
						selectedAccountType
					)
				}
				className={className}
				placeholder={placeholder}
			/>
		</div>
	)
}

export function Dropdown({
	title,
	elementName,
	dropdownOptions,
	defaultDropdownText,
	getDropdownOptionValue,
	getDropdownOptionText,
}) {
	const { formData, formErrors, selectedAccountType, setFormData, setFormErrors } =
		useContext(ModalBodyContext)

	return (
		<div className="form-group">
			<label>{title}*</label>
			<select
				name={elementName}
				value={formData[selectedAccountType][elementName]}
				onChange={(event) =>
					updateFormState(
						event,
						setFormData,
						setFormErrors,
						selectedAccountType
					)
				}
				className={
					formErrors[selectedAccountType]?.[elementName]
						? INVALID_INPUT_CLASS
						: VALID_INPUT_CLASS
				}
			>
				<option value={DEFAULT_FORM_VALUE}>{defaultDropdownText}</option>
				{dropdownOptions.map((dropdownOption) => {

					const dropdownValue = getDropdownOptionValue
						? getDropdownOptionValue(dropdownOption)
						: dropdownOption
					const dropdownText = getDropdownOptionText
						? getDropdownOptionText(dropdownOption)
						: dropdownOption

					return (
						<option key={dropdownValue} value={dropdownValue}>
							{dropdownText}
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
			dropdownOptions={LocationOptions}
			defaultDropdownText="Select your location"
		/>
	)
}

export function YesOrNoDropdown({ title, elementName }) {
	const yesNoOptions = [YesOrNoEnum.YES, YesOrNoEnum.NO]
	return (
		<Dropdown
			title={title}
			elementName={elementName}
			dropdownOptions={yesNoOptions}
			defaultDropdownText="Select an option"
			getDropdownOptionText={(option) =>
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
			dropdownOptions={experienceOptions}
			defaultDropdownText="Select experience level"
			getDropdownOptionValue={(experience) => YearsOfExperienceOptions[experience]}
			getDropdownOptionText={(experience) =>
				`${YearsOfExperienceOptions[experience]} years`
			}
		/>
	)
}

export function DesiredSkillLevelDropdown() {
	const skillLevelOptions = Object.values(SkillLevelOptions)
	return (
		<Dropdown
			title="Desired Skill Level"
			elementName="desiredSkillLevel"
			dropdownOptions={skillLevelOptions}
			defaultDropdownText="Select desired skill level"
			getDropdownOptionValue={(level) => level.toLowerCase()}
		/>
	)
}

export function PlayStyleDropdown() {
	const playstyleOptions = Object.values(PlaystyleOptions)
	return (
		<Dropdown
			title="Preferred Playstyle"
			elementName="playstyle"
			options={playstyleOptions}
			defaultDropdownText="Select preferred playstyle"
			getDropdownOptionValue={(level) => level.toLowerCase()}
		/>
	)
}

function UsernameInputTextField({ gameName }) {
	const { formData, selectedAccountType, setFormData } = useContext(ModalBodyContext)
	return (
		<input
			type="text"
			placeholder={
				Placeholders[gameName] || `Enter your ${GameOptions[gameName]} username`
			}
			value={
				formData[selectedAccountType].gameUsernames[GameOptions[gameName]] ||
				DEFAULT_FORM_VALUE
			}
			onChange={(event) =>
				handleUsernameChangeLogic(
					GameOptions[gameName],
					event.target.value,
					setFormData,
					selectedAccountType
				)
			}
			className="game-username-input"
		/>
	)
}

export function GamesSelection({ title }) {
	const { formData, formErrors, selectedAccountType, setFormData, setFormErrors } =
		useContext(ModalBodyContext)

	const gamesField =
		selectedAccountType === AccountType.TEAM
			? SUPPORTED_GAMES_FIELD
			: GAMING_EXPERIENCE_FIELD
	const currentSelectedGames = formData[selectedAccountType][gamesField]

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
								checked={currentSelectedGames.includes(GameOptions[game])}
								onChange={(event) =>
									handleGameSelectionLogic(
										GameOptions[game],
										event.target.value,
										setFormData,
										setFormErrors,
										selectedAccountType
									)
								}
								className="game-checkbox"
							/>
						</div>
						{selectedAccountType == AccountType.PLAYER &&
							currentSelectedGames.includes(GameOptions[game]) && (
								<div className="username-input-container">
									<UsernameInputTextField gameName={game} />
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
	const { formData, formErrors, selectedAccountType, setFormErrors, setFormData } =
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
									handlePlaystyleSelectionLogic(
										PlaystyleOptions[playstyle],
										setFormData,
										setFormErrors,
										selectedAccountType
									)
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
