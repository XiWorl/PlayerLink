import { getProfileData } from "../api"
import { useEffect, useState } from "react"
import { AccountType } from "../utils/globalUtils"
import { useParams } from "react-router-dom"
import TeamProfile from "../components/Profile/TeamProfile"
import Navbar from "../components/Navbar/Navbar"
import UserProfile from "../components/Profile/UserProfile"
import "../components/Profile/ProfilePage.css"

const INITIAL_DISPLAY_ID = -1
let currentAccountIdDisplayed = INITIAL_DISPLAY_ID

async function displayProfileData(accountType, id, setAccountData, setIsLoading) {
	const data = await getProfileData(accountType, id)
	setAccountData(data)
	setIsLoading(false)
}

export default function ProfilePage({ accountType }) {
	const [accountData, setAccountData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const { id } = useParams()

	if (id != currentAccountIdDisplayed) {
		setIsLoading(true)
		displayProfileData(accountType, id, setAccountData, setIsLoading)
	}

	useEffect(() => {
		displayProfileData(accountType, id, setAccountData, setIsLoading)
	}, [])
	currentAccountIdDisplayed = id

	return accountType == AccountType.PLAYER ? (
		<>
			<Navbar />
			<UserProfile isLoading={isLoading} accountData={accountData} />
		</>
	) : (
		<>
			<Navbar />
			<TeamProfile isLoading={isLoading} accountData={accountData} />
		</>
	)
}
