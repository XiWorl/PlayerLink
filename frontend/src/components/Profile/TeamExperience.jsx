import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AccountType } from "../../utils/globalUtils"
import { getProfileData } from "../../api"

async function addProfileToTeamExperience(id, setTeams) {
	const profileInformation = await getProfileData(AccountType.TEAM, id)
	setTeams((prevTeams) => {
		return [...prevTeams, profileInformation]
	})
}

export function TeamExperience({ rosterAccountIds }) {
	const navigate = useNavigate()
	const [teams, setTeams] = useState([])

	useEffect(() => {
		for (const id of rosterAccountIds) {
			addProfileToTeamExperience(id, setTeams)
		}
	}, [])

	return (
		<div className="roster-container">
			{teams.map((profileInformation, index) => {
				return (
					<div className="roster-tile" key={index}>
						<div
							className="apply-profile-picture pointer"
							onClick={() => {
								navigate(`/teams/${profileInformation.accountId}`)
							}}
						></div>
						<div className="roster-tile-information">
							<h4>{profileInformation.name || ""}</h4>
							<h5>{profileInformation.description}</h5>
						</div>
					</div>
				)
			})}
		</div>
	)
}
