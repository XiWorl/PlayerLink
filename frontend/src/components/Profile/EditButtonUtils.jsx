import { TOKEN_SESSION_KEY, BASEURL, AccountType } from "../../utils/globalUtils"
import { useContext } from "react"
import { UserProfileContext } from "../Profile/UserProfile"
import { TeamProfileContext } from "../Profile/TeamProfile"
import { LOGIN_FAILURE } from "../../api"
import { TypeOfEditButton } from "./EditButton"

export async function modalSubmitHelper(textValue, detailType, accountType, id) {
	const token = sessionStorage.getItem(TOKEN_SESSION_KEY)
	if (token == null) {
		return
	}

	detailType = detailType.toUpperCase()

	try {
		const response = await fetch(`${BASEURL}/api/profiles/edit`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				accountId: id,
				editType: detailType,
				value: textValue,
				accountType: accountType,
			}),
		})

		if (response.ok === true) {
			const data = await response.json()
			return data
		} else {
			return LOGIN_FAILURE
		}
	} catch (error) {
		console.error(`Error while attempting to update ${detailType}:`, error)
	}
}

async function submitHelper(textValue, typeOfEditButton, accountType, id, setButtonText) {
	const updatedAboutObject = await modalSubmitHelper(
		textValue,
		typeOfEditButton,
		accountType,
		id
	)
	if (updatedAboutObject.updatedValue != null)
		setButtonText(updatedAboutObject.updatedValue)
}

export function onAboutModalSubmitButtonClicked(textValue) {
	const { setAbout, id } = useContext(UserProfileContext)
	return async function () {
		submitHelper(textValue, TypeOfEditButton.ABOUT, AccountType.PLAYER, id, setAbout)
	}
}
export function onBioModalSubmitButtonClicked(textValue) {
	const { setBio, id } = useContext(UserProfileContext)
	return async function () {
		submitHelper(textValue, TypeOfEditButton.BIO, AccountType.PLAYER, id, setBio)
	}
}
export function onDescriptionModalSubmitButtonClicked(textValue) {
	const { setDescription, id } = useContext(TeamProfileContext)
	return async function () {
		submitHelper(
			textValue,
			TypeOfEditButton.DESCRIPTION,
			AccountType.TEAM,
			id,
			setDescription
		)
	}
}
export function onOverviewModalSubmitButtonClicked(textValue) {
	const { setOverview, id } = useContext(TeamProfileContext)
	return async function () {
		submitHelper(
			textValue,
			TypeOfEditButton.OVERVIEW,
			AccountType.TEAM,
			id,
			setOverview
		)
	}
}
