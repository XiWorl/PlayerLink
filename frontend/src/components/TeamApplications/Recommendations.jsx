import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getRecommendations, updateRecommendationStatus } from "../../api"

const RecommendationStatus = {
	INTERESTED: "Interested",
	NOT_INTERESTED: "Not Interested",
}

async function onRecommendationClick(status, playerAccountId, teamAccountId, navigate, setRecommendations) {
    const updateRecommendations = await updateRecommendationStatus(playerAccountId, teamAccountId, status)

	if (status === RecommendationStatus.INTERESTED) {
		navigate(`/teams/${teamAccountId}`)
	} else if (status === RecommendationStatus.NOT_INTERESTED) {
        setRecommendations(updateRecommendations)
	}
}
function RecommendationTile({ teamData, playerAccountId, setRecommendations }) {
	const navigate = useNavigate()

	return (
		<div className="recommendation">
			<h2
				className="recommendation-h2"
				onClick={() => {
					navigate(`/teams/${teamData.team.accountId}`)
				}}
			>
				{teamData.team.name}
			</h2>
			<div className="recommendation-buttons">
				<button
					className="recommendation-btn"
					onClick={() =>
						onRecommendationClick(
							RecommendationStatus.NOT_INTERESTED,
							playerAccountId,
							teamData.team.accountId,
							navigate, setRecommendations
						)
					}
				>
					Not Interested
				</button>
				<button
					className="recommendation-btn accept"
					onClick={() =>
						onRecommendationClick(
							RecommendationStatus.INTERESTED,
							playerAccountId,
							teamData.team.accountId,
							navigate, setRecommendations
						)
					}
				>
					Interested
				</button>
			</div>
		</div>
	)
}

async function loadRecommendations(setRecommendations, accountId) {
	const recommendations = await getRecommendations(accountId)
	setRecommendations(recommendations)
}

export function Recommendations({ accountId }) {
	const [recommendations, setRecommendations] = useState([])

	useEffect(() => {
		loadRecommendations(setRecommendations, accountId)
	}, [])

	recommendations.sort((a, b) => {
		return b.score - a.score
	})
	return (
		<div className="postings">
			{recommendations.map((recommendation, index) => {
				return (
					<RecommendationTile
						key={index}
						teamData={recommendation}
						playerAccountId={accountId}
                        setRecommendations={setRecommendations}
					/>
				)
			})}
		</div>
	)
}
