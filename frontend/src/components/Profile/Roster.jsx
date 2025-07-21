import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AccountType } from "../../utils/globalUtils"
import { getProfileData } from "../../api"

async function addProfileToRoster(id, setRoster, roster) {
	const profileInformation = await getProfileData(AccountType.PLAYER, id)
	setRoster([...roster, profileInformation])
}

function createRosterTile() {}

export function Roster({ accountRosterIds }) {
	const navigate = useNavigate()
	const [roster, setRoster] = useState([])

	useEffect(() => {
		for (const id of accountRosterIds) {
			addProfileToRoster(id, setRoster, roster)
		}
	}, [accountRosterIds])

	return (
		<div className="profile-about">
			<div className="profile-about-header">
				<h3>Roster</h3>
			</div>
			<div className="roster-container">
				{roster.map((profileInformation, index) => {
					return (
						<div className="roster-tile" onClick={() => {navigate(`/profiles/${profileInformation.accountId}`)}}>
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
