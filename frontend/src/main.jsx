import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AccountType } from "./components/SignupModal/utils.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import PrivateRoute from "./utils/PrivateRoute.jsx"

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={CLIENT_ID}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route
						path="/profiles/:id"
						element={
							<PrivateRoute
								page={<ProfilePage accountType={AccountType.PLAYER} />}
							/>
						}
					/>
				</Routes>
			</BrowserRouter>
		</GoogleOAuthProvider>
	</StrictMode>
)
