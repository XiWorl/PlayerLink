import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProfilePage from "./components/Profile/ProfilePage"

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={CLIENT_ID}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Routes>
			</BrowserRouter>
		</GoogleOAuthProvider>
	</StrictMode>
)
