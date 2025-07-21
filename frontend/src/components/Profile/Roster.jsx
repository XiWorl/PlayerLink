import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AccountType } from "../../utils/globalUtils"
import { getProfileData } from "../../api"

async function addProfileToRoster(id, setRoster, roster) {
	const profileInformation = await getProfileData(AccountType.PLAYER, id)
        setRoster(prevRoster => [...prevRoster, profileInformation])
}


export function Roster({ accountRosterIds }) {
    console.log(accountRosterIds)
	const navigate = useNavigate()
	const [roster, setRoster] = useState([])

	useEffect(() => {
		for (const id of accountRosterIds) {
			addProfileToRoster(id, setRoster, roster)
		}
	}, [])

    console.log(roster)
	return (
		<div className="profile-about">
			<div className="profile-about-header">
				<h3>Roster</h3>
			</div>
			<div className="roster-container">
				{roster.map((profileInformation, index) => {
					return (
						<div className="roster-tile" key={index} onClick={() => {navigate(`/profiles/${profileInformation.accountId}`)}}>
							<div className="apply-profile-picture"></div>
							<div className="roster-tile-information">
								<h4>{profileInformation.firstName || ""} {profileInformation.lastName || ""}</h4>
								<h5>{profileInformation.bio}</h5>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
