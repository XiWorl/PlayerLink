import { Navigate } from "react-router-dom"
import { isLoggedIn } from "./utils"

export default function PrivateRoute({ page }) {
	return isLoggedIn() ? page : <Navigate to="/" />
}
