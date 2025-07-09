import { createTeamApplication } from "../../api"
import { useNavigate } from "react-router-dom"

async function onApplyButtonClick(navigate, playerAccountId, teamAccountId) {
	await createTeamApplication(playerAccountId, teamAccountId)
	navigate(`/apply/${playerAccountId}`)
}

export default function ApplyButton({ playerAccountId, teamAccountId }) {
	const navigate = useNavigate()
	return (
		<button
			onClick={() => onApplyButtonClick(navigate, playerAccountId, teamAccountId)}
		>
			Apply
		</button>
	)
}
