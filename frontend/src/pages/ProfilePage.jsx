import { getProfileData } from "../api"
import { useEffect, useState } from "react"
import { AccountType } from "../utils/globalUtils"
import { useParams } from "react-router-dom"
import TeamProfile from "../components/TeamProfile/TeamProfile"
import Navbar from "../components/Navbar/Navbar"
import PlayerProfile from "../components/PlayerProfile/PlayerProfile"
import "../components/ProfileUtils/ProfilePage.css"

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
			<PlayerProfile
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
