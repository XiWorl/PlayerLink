const LoginTokenKey = "GoogleLoginToken"

export function isLoggedIn() {
	return localStorage.getItem(LoginTokenKey) !== null
}
