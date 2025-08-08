import {
	EditProfileTextButton,
	TypeOfEditButton,
} from "../ProfileUtils/EditProfileButton"
import { AccountType, getAccountDataFromSessionStorage } from "../../utils/globalUtils"
import { modalSubmitHelper } from "../ProfileUtils/EditProfileButtonUtils"
import { useParams } from "react-router-dom"
import { useState } from "react"
import TeamAffiliations from "./TeamAffiliations"
import GamingExperience from "./GamingExperience"
import LoadingScreen from "../LoadingScreen/LoadingScreen"
import EditAccountButton from "../ProfileUtils/EditAccountButton"
import MessageAccountButton from "../ProfileUtils/MessageAccountButton"
import Navbar from "../Navbar/Navbar"
import "../ProfileUtils/ProfilePage.css"

const DEFAULT_PROFILE_INFO = ""

export default function PlayerProfile({ isLoading, accountData, setIsLoading }) {
	if (isLoading || accountData.teamId != null) {
		setIsLoading(true)
		return <LoadingScreen message={"Loading Profile..."} />
	}

	const [bio, setBio] = useState(accountData.bio || DEFAULT_PROFILE_INFO)
	const [about, setAbout] = useState(accountData.about || DEFAULT_PROFILE_INFO)
	const { id } = useParams()
	const sessionStorageAccountData = getAccountDataFromSessionStorage()

	return (
		<>
			<Navbar />
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
							<p className="profile-title-text">{`${
								bio || DEFAULT_PROFILE_INFO
							}`}</p>
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
						{sessionStorageAccountData.id == accountData.accountId && (
							<EditAccountButton
								accountType={AccountType.PLAYER}
								accountData={accountData}
								setIsLoading={setIsLoading}
							/>
						)}
					</div>
					<div>
						{sessionStorageAccountData.id != accountData.accountId && (
							<MessageAccountButton profileData={accountData} />
						)}
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
					<p className="profile-about-text">{`${
						about || DEFAULT_PROFILE_INFO
					}`}</p>
				</div>
				{Object.keys(accountData.games).length > 0 && (
					<div className="profile-about">
						<div className="profile-about-header">
							<h3>Gaming Experience</h3>
						</div>
						<GamingExperience accountData={accountData} />
					</div>
				)}
				{<TeamAffiliations rosterAccountIds={accountData.rosterAccountIds} />}
			</div>
		</>
	)
}
