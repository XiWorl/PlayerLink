import { getAccountDataFromSessionStorage } from "../utils/globalUtils"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Applications } from "../components/TeamApplications/Applications"
import Navbar from "../components/Navbar/Navbar"

async function validateUserPermissionToViewPage(setAccountData, id) {
	const accountData = getAccountDataFromSessionStorage()
	if (accountData === null) {
		return false
	}
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
