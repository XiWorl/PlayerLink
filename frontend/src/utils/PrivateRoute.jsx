import { Navigate } from "react-router-dom"
import { isLoggedIn } from "./globalUtils"

export default function PrivateRoute({ page }) {
	return isLoggedIn() ? page : <Navigate to="/" />
}
