import { AccountType } from "../../utils/globalUtils"
import { getAccountDataFromSessionStorage } from "../../utils/globalUtils"
import { ApplicationModal } from "./ApplicationModal"
import { useEffect, useState, createContext } from "react"
import { getProfileData } from "../../api"

export const ApplicationTileContext = createContext()

function getPostContent(
	profileName,
	profileDescription,
	applicationStatus,
	setIsApplicationModalOpen,
	openValue
) {
	return (
		<div className="post" onClick={() => setIsApplicationModalOpen(openValue)}>
			<div className="apply-profile-picture">
				{profileName.charAt(0).toUpperCase()}
			</div>
			<div className="apply-details">
				<h2>{profileName}</h2>
				<div className="post-information">
					<h3>{profileDescription}</h3>
					<div className={`post-information-status ${applicationStatus}`}>
						{applicationStatus.charAt(0).toUpperCase() +
							applicationStatus.slice(1)}
					</div>
				</div>
			</div>
		</div>
	)
}

async function loadProfileData(accountType, accountId, setProfileInformation) {
	const profileData = await getProfileData(accountType, accountId)
	setProfileInformation(profileData)
}

export function ApplicationTile({ applicationData }) {
	const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
	const [profileInformation, setProfileInformation] = useState(null)
	const [applicationStatus, setApplicationStatus] = useState(applicationData.status)
	const accountData = getAccountDataFromSessionStorage()

	const oppositeAccountTypeOfAccount =
		accountData.accountType === AccountType.PLAYER
			? AccountType.TEAM
			: AccountType.PLAYER

	if (accountData == null || accountData.accountType == null) {
		return null
	}

	useEffect(() => {
		if (accountData.accountType === AccountType.TEAM) {
			loadProfileData(
				oppositeAccountTypeOfAccount,
				applicationData.playerAccountId,
				setProfileInformation
			)
		} else {
			loadProfileData(
				oppositeAccountTypeOfAccount,
				applicationData.teamAccountId,
				setProfileInformation
			)
		}
	}, [])

	if (profileInformation == null) {
		return <div className="post error">Failed to load profile information</div>
	}

	let postContent = null
	if (accountData.accountType === AccountType.TEAM) {
		postContent = getPostContent(
			`${profileInformation.firstName} ${profileInformation.lastName}`,
			profileInformation.bio,
			applicationStatus,
			setIsApplicationModalOpen,
			true
		)
	} else {
		postContent = getPostContent(
			profileInformation.name,
			profileInformation.description,
			applicationStatus,
			setIsApplicationModalOpen,
			false
		)
	}

	return (
		<ApplicationTileContext.Provider
			value={{
				profileInformation,
				setIsApplicationModalOpen,
				applicationStatus,
				setApplicationStatus,
			}}
		>
			{isApplicationModalOpen && (
				<ApplicationModal
					playerAccountInformation={profileInformation}
					setIsApplicationModalOpen={setIsApplicationModalOpen}
					teamAccountId={applicationData.teamAccountId}
				/>
			)}
			{postContent}
		</ApplicationTileContext.Provider>
	)
}
