import { BASEURL } from "../../utils/globalUtils"
import AccountTile from "./AccountTile"

export function redirectToAccountProfile(accountInformation, accountType, navigate) {
    return function () {
        const navigationPath = accountType == AccountType.TEAM ? "teams" : "profiles"
        navigate(`/${navigationPath}/${accountInformation.accountId}`)
    }
}

export async function loadPage(selectedAccountType, page, setTotalPages, setDisplay) {
    try {
        const response = await fetch(
            `${BASEURL}/collection/${selectedAccountType}s/?page=${page}`
        )
        const pageData = await response.json()
        if (!response.ok) throw new Error()

        setTotalPages(pageData.totalPages)
        setDisplay(
            pageData.data.map((account) =>
                AccountTile(account)
            )
        )
    } catch (error) {
        console.error(`Error while retrieving page ${page} data:`, error)
    }
}
