import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getRecommendations, updateRecommendationStatus } from "../../api"

const RecommendationStatus = {
	INTERESTED: "Interested",
	NOT_INTERESTED: "Not Interested",
}

function RecommendationTile({ teamData, playerAccountId }) {
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
						updateRecommendationStatus(
							playerAccountId,
							teamData.team.accountId,
							RecommendationStatus.NOT_INTERESTED
						)
					}
				>
					Not Interested
				</button>
				<button
					className="recommendation-btn accept"
					onClick={() =>
						updateRecommendationStatus(
							playerAccountId,
							teamData.team.accountId,
							RecommendationStatus.INTERESTED
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

export function Recommendations({ accountData, accountId }) {
	const [recommendations, setRecommendations] = useState([])
	useEffect(() => {
		loadRecommendations(setRecommendations, accountId)
	}, [])
	console.log(recommendations)
	recommendations.sort((a, b) => {
		return b.score - a.score
	})
	return (
		<div className="postings">
			<h1>HELLO</h1>
			{recommendations.map((recommendation, index) => {
				return <RecommendationTile key={index} teamData={recommendation} playerAccountId={accountId}/>
			})}
		</div>
	)
}
