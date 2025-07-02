import { getProfileData } from "../api"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AccountType } from "../components/SignupModal/utils"
import { TeamProfile } from "../components/Profile/TeamProfile"
import UserProfile from "../components/Profile/UserProfile"
import "../components/Profile/ProfilePage.css"

export default function ProfilePage({ accountType }) {
	const [accountData, setAccountData] = useState(null)
	useEffect(() => {
		async function getData() {
			const data = await getProfileData(accountType, 1)
			setAccountData(data)
		}
		getData()
	}, [])

	return accountType == AccountType.PLAYER ? <UserProfile accountData={accountData}/> : <TeamProfile accountData={accountData}/>
}
