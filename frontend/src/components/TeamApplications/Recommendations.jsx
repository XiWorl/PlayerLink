import { useState, useEffect } from "react"
import { getRecommendations } from "../../api"


function RecommendationTile({teamData}) {
    return (
        <div className="recommendation">
            <h2>Recommendation Title</h2>
            <div className="recommendation-buttons">

            <button className="recommendation-btn accept">Accept</button>
            <button className="recommendation-btn">Deny</button>
            </div>
        </div>
    )
}

async function loadRecommendations(setRecommendations, accountId) {
    const recommendations = await getRecommendations(accountId)
    setRecommendations(recommendations)
}

export function Recommendations({accountData, accountId}) {
    const [recommendations, setRecommendations] = useState([])
    useEffect(() => {
        loadRecommendations(setRecommendations, accountId)
    }, [])

    return (

        <div className="postings">
            <h1>HELLO</h1>
            <RecommendationTile />
        </div>
    )
}
