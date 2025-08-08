import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AccountType } from "./utils/globalUtils.js"
import { BracketPage } from "./pages/TournamentBracketPage.jsx"
import App from "./App.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import PrivateRoute from "./utils/PrivateRoute.jsx"
import ConnectPage from "./pages/ConnectPage.jsx"
import ApplyPage from "./pages/ApplyPage.jsx"
import TournamentsPage from "./pages/TournamentsPage.jsx"
import MessagesPage from "./pages/MessagesPage.jsx"

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById("root")).render(
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
				<Route
					path="/teams/:id"
					element={
						<PrivateRoute
							page={<ProfilePage accountType={AccountType.TEAM} />}
						/>
					}
				/>
				<Route
					path="/connect"
					element={<PrivateRoute page={<ConnectPage />} />}
				/>
				<Route
					path="/apply/:id"
					element={<PrivateRoute page={<ApplyPage />} />}
				/>
				<Route
					path="/tournaments"
					element={<PrivateRoute page={<TournamentsPage />} />}
				/>
				<Route
					path="/tournaments/:id"
					element={<PrivateRoute page={<BracketPage />} />}
				/>
				<Route
					path="/messages"
					element={<PrivateRoute page={<MessagesPage />} />}
				/>
			</Routes>
		</BrowserRouter>
	</GoogleOAuthProvider>
)
