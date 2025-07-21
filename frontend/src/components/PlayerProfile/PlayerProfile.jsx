import { EditProfileTextButton, TypeOfEditButton } from "../ProfileUtils/EditProfileButton"
import { AccountType } from "../../utils/globalUtils"
import { modalSubmitHelper } from "../ProfileUtils/EditProfileButtonUtils"
import { useParams } from "react-router-dom"
import { useState } from "react"
import "../ProfileUtils/ProfilePage.css"
const defaultProfileInfo = ""

export default function PlayerProfile({ isLoading, accountData, setIsLoading }) {
	if (isLoading || accountData.teamId != null) {
		setIsLoading(true)
		return <h1>Loading...</h1>
	}

	const [bio, setBio] = useState(accountData.bio || defaultProfileInfo)
	const [about, setAbout] = useState(accountData.about || defaultProfileInfo)
	const { id } = useParams()

	return (
		<div className="profile-page">
			<div className="profile-banner">
				<div className="profile-picture">
					<div className="profile-picture-placeholder">
						{accountData.firstName.charAt(0)}
					</div>
				</div>
			</div>
			<div className="profile-header">
				<div className="profile-info">
					<h1 className="profile-name">{`${accountData.firstName} ${accountData.lastName}`}</h1>
					<div className="profile-title">
						<p className="profile-title-text">{`${bio}`}</p>
						<EditProfileTextButton
							modalTitle={"Edit Bio"}
							onSubmitButtonClicked={(textValue) =>
								modalSubmitHelper(
									textValue,
									TypeOfEditButton.BIO,
									AccountType.PLAYER,
									id,
									setBio
								)
							}
							profileId={id}
						/>
					</div>
					<p className="profile-location">📍 {accountData.location}</p>
				</div>
			</div>
			<div className="profile-about">
				<div className="profile-about-header">
					<h3>About</h3>
					<EditProfileTextButton
						modalTitle={"Edit About"}
						onSubmitButtonClicked={(textValue) =>
							modalSubmitHelper(
								textValue,
								TypeOfEditButton.ABOUT,
								AccountType.PLAYER,
								id,
								setAbout
							)
						}
						profileId={id}
					/>
				</div>
				<p className="profile-about-text">{`${about}`}</p>
			</div>
		</div>
	)
}
