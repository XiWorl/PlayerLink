import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProfilePage from './Pages/ProfilePage.jsx';
import App from './App.jsx'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />
	},
	{
		path: "/profile",
		element: <ProfilePage />
	},
])

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={CLIENT_ID}>
			<RouterProvider router={router} />
		</GoogleOAuthProvider>
	</StrictMode>,
)
