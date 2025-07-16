import { TOKEN_SESSION_KEY, BASEURL, AccountType } from "../../utils/globalUtils"
import { LOGIN_FAILURE } from "../../api"

export async function modalSubmitHelper(textValue, detailType, accountType, id, setButtonText) {
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
			const profileTextInformation = await response.json()
			setButtonText(profileTextInformation.updatedValue)
			return profileTextInformation
		} else {
			return LOGIN_FAILURE
		}
	} catch (error) {
		console.error(`Error while attempting to update ${detailType}:`, error)
	}
}
