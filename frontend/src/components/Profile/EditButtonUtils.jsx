import { TOKEN_STORAGE_KEY, BASEURL, AccountType } from "../../utils/globalUtils"
import { LOGIN_FAILURE } from "../../api"

export async function modalSubmitHelper(textValue, detailType, accountType, id) {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)
	if (token == null) {
		return
	}

	const profileType = accountType === AccountType.PLAYER ? "profiles" : "teams"
	detailType = detailType.toUpperCase()

	try {
		const response = await fetch(`${BASEURL}/api/${profileType}/edit`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				accountId: id,
				editType: detailType,
				value: textValue,
			}),
		})

		if (response.ok === true) {
			const data = await response.json()
			return data
		} else {
			return LOGIN_FAILURE
		}
	} catch (error) {
		console.error("Error trying to login:", error)
	}
}
