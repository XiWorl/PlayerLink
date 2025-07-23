import {
	EditProfileTextButton,
	TypeOfEditButton,
} from "../ProfileUtils/EditProfileButton"
import { modalSubmitHelper } from "../ProfileUtils/EditProfileButtonUtils"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { getAccountDataFromSessionStorage, AccountType } from "../../utils/globalUtils"
import Navbar from "../Navbar/Navbar"
import EditAccountButton from "../ProfileUtils/EditAccountButton"
import ApplyButton from "./ApplyButton"
import LoadingScreen from "../LoadingScreen/LoadingScreen"
import "../ProfileUtils/ProfilePage.css"

const DEFAULT_PROFILE_INFO = ""

export default function TeamProfile({ isLoading, accountData, setIsLoading }) {
	if (isLoading || accountData.playerId != null) {
		setIsLoading(true)
		return <LoadingScreen message={"Loading Profile..."} />
	}

	const { id } = useParams()
	const [description, setDescription] = useState(
		accountData.description || DEFAULT_PROFILE_INFO
	)
	const [overview, setOverview] = useState(accountData.overview || DEFAULT_PROFILE_INFO)
	const sessionStorageAccountData = getAccountDataFromSessionStorage()

	return (
		<>
			<Navbar />
			<div className="profile-page">
				<div className="profile-banner">
					<div className="profile-picture">
						<div className="profile-picture-placeholder">
							{accountData.name.charAt(0)}
						</div>
					</div>
				</div>
				<div className="profile-header">
					<div className="profile-info">
						<h1 className="profile-name">{`${accountData.name}`}</h1>
						<div className="profile-title">
							<p className="profile-title-text">{`${
								description || DEFAULT_PROFILE_INFO
							}`}</p>
							<EditProfileTextButton
								modalTitle={"Edit Description"}
								onSubmitButtonClicked={(textValue) =>
									modalSubmitHelper(
										textValue,
										TypeOfEditButton.DESCRIPTION,
										AccountType.TEAM,
										id,
										setDescription
									)
								}
								profileId={id}
							/>
						</div>
						<p className="profile-location">📍 {accountData.location}</p>
					</div>
					<div>
						<EditAccountButton
							accountType={AccountType.TEAM}
							accountData={accountData}
							setIsLoading={setIsLoading}
						/>
						<div>
							<button>Home</button>
							<button>Roster</button>
							{sessionStorageAccountData &&
								sessionStorageAccountData.accountType !=
									AccountType.TEAM &&
								sessionStorageAccountData.id !==
									accountData.accountId && (
									<ApplyButton
										playerAccountId={sessionStorageAccountData.id}
										teamAccountId={accountData.accountId}
									/>
								)}
						</div>
					</div>
				</div>
				<div className="profile-about">
					<div className="profile-about-header">
						<h3>Overview</h3>
						<EditProfileTextButton
							modalTitle={"Edit Overview"}
							onSubmitButtonClicked={(textValue) =>
								modalSubmitHelper(
									textValue,
									TypeOfEditButton.OVERVIEW,
									AccountType.TEAM,
									id,
									setOverview
								)
							}
							profileId={id}
						/>
					</div>
					<p className="profile-about-text">{`${
						overview || DEFAULT_PROFILE_INFO
					}`}</p>
				</div>
			</div>
		</>
	)
}
