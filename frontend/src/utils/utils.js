export const GoogleEmailKey = "GoogleEmail"

export function convertToBoolean(value) {
	if (value.toLowerCase() == "yes") {
		return true
	} else return false
}

export function isLoggedIn() {
	return localStorage.getItem(GoogleEmailKey) !== null
}
