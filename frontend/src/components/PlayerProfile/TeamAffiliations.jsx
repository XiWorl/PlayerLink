import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AccountType } from "../../utils/globalUtils"
import { getProfileData } from "../../api"

async function addTeamToAffiliations(id, setRoster) {
	const profileInformation = await getProfileData(AccountType.TEAM, id)
	setRoster((prevRoster) => {
		return [...prevRoster, profileInformation]
	})
}

export default function TeamAffiliations({ rosterAccountIds }) {
	const navigate = useNavigate()
	const [roster, setRoster] = useState([])

	useEffect(() => {
		for (const id of rosterAccountIds) {
			addTeamToAffiliations(id, setRoster)
		}
	}, [])

	return (
		<div className="profile-about">
			<div className="profile-about-header">
				<h3>Team Affiliations</h3>
			</div>
			<div className="roster-container">
				{roster.map((profileInformation, index) => {
					return (
						<div
							className="roster-tile pointer"
							key={index}
							onClick={() => {
								navigate(`/teams/${profileInformation.accountId}`)
							}}
						>
							<div className="apply-profile-picture">{profileInformation.name.charAt(0).toUpperCase()}</div>
							<div className="roster-tile-information">
								<h4>{profileInformation.name}</h4>
								<h5>{profileInformation.description || ""}</h5>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
