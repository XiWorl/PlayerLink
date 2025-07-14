import { getProfileData } from "../api"
import { useEffect, useState } from "react"
import { AccountType } from "../utils/globalUtils"
import { useParams } from "react-router-dom"
import TeamProfile from "../components/Profile/TeamProfile"
import Navbar from "../components/Navbar/Navbar"
import UserProfile from "../components/Profile/UserProfile"
import "../components/Profile/ProfilePage.css"

async function displayProfileData(accountType, id, setAccountData, setIsLoading) {
	const data = await getProfileData(accountType, id)
	setAccountData(data)
	setIsLoading(false)
}

export default function ProfilePage({ accountType }) {
	const [accountData, setAccountData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const { id } = useParams()

	useEffect(() => {
		setIsLoading(true)
		displayProfileData(accountType, id, setAccountData, setIsLoading)
	}, [id])

	return accountType == AccountType.PLAYER ? (
		<>
			<Navbar />
			<UserProfile
				isLoading={isLoading}
				accountData={accountData}
				setIsLoading={setIsLoading}
			/>
		</>
	) : (
		<>
			<Navbar />
			<TeamProfile
				isLoading={isLoading}
				accountData={accountData}
				setIsLoading={setIsLoading}
			/>
		</>
	)
}
