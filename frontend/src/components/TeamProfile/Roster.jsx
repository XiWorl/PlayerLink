import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AccountType } from "../../utils/globalUtils"
import { getProfileData } from "../../api"

async function addProfileToRoster(id, setRoster) {
	const profileInformation = await getProfileData(AccountType.PLAYER, id)
	setRoster((prevRoster) => {
		return [...prevRoster, profileInformation]
	})
}

export function Roster({ accountRosterIds }) {
	const navigate = useNavigate()
	const [roster, setRoster] = useState([])

	useEffect(() => {
		for (const id of accountRosterIds) {
			addProfileToRoster(id, setRoster)
		}
	}, [])

	return (
		<div className="profile-about">
			<div className="profile-about-header">
				<h3>Roster</h3>
			</div>
			<div className="roster-container">
				{roster.map((profileInformation, index) => {
					return (
						<div
							className="roster-tile pointer"
							key={index}
							onClick={() => {
								navigate(`/profiles/${profileInformation.accountId}`)
							}}
						>
							<div className="apply-profile-picture">{profileInformation.firstName.charAt(0).toUpperCase()}</div>
							<div className="roster-tile-information">
								<h4>
									{profileInformation.firstName || ""}{" "}
									{profileInformation.lastName || ""}
								</h4>
								<h5>{profileInformation.bio}</h5>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
