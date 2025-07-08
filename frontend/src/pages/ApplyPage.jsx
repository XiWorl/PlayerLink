import { AccountType, TOKEN_STORAGE_KEY } from "../utils/globalUtils"
import { useParams } from "react-router-dom"
import { use, useEffect, useState } from "react"
import { getProfileDataWithToken } from "../api"
import { Applications } from "../components/TeamApplication/Applications"
import Navbar from "../components/Navbar/Navbar"
import "../components/TeamApplication/ApplyPage.css"

async function validateUserPermissionToViewPage(setAccountData, id) {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)
	const accountData = await getProfileDataWithToken(token)

	if (accountData.id.toString() === id.toString()) {
		setAccountData(accountData)
		return true
	}
	return false
}

export default function ApplyPage() {
	const { id } = useParams()
	const [accountData, setAccountData] = useState(null)

	useEffect(() => {
		validateUserPermissionToViewPage(setAccountData, id)
	}, [])

	return accountData !== null ? (
		<>
			<Navbar />
			<Applications accountData={accountData} accountId={id} />
		</>
	) : (
		<>
			<Navbar />
			<h1>You don't have permission to view this page</h1>
		</>
	)
}
