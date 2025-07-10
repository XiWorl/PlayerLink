import { AboutEditButton, BioEditButton } from "./EditButton"
import { EditProfileButton } from "./EditProfile"
import { createContext, useState } from "react"
import "./ProfilePage.css"
const defaultProfileInfo = ""
import ModalBody from "../TheModal/ModalBody"

export const UserProfileContext = createContext()

function MyComponent({ title }) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleSubmit = (formData) => {
		console.log("User data:", formData)
		// Handle the submitted data
		// formData contains: firstName, lastName, location, willingToRelocate,
		// yearsOfExperience, gamesPlayed, playStyle
	}

	const handleClose = () => {
		setIsModalOpen(false)
	}

	return (
		<div>
			<button onClick={() => setIsModalOpen(true)}>Open User Info Modal</button>

			<ModalBody
				isOpen={isModalOpen}
				onClose={handleClose}
				onSubmit={handleSubmit}
				title={title}
				accountType="team"
			/>
		</div>
	)
}

export default function UserProfile({ isLoading, accountData }) {
	if (isLoading) {
		return <h1>Loading...</h1>
	}

	const [bio, setBio] = useState(accountData.bio || defaultProfileInfo)
	const [about, setAbout] = useState(accountData.about || defaultProfileInfo)

	return (
		<UserProfileContext.Provider value={{ setAbout, setBio }}>
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
							{/* <BioEditButton /> */}
							{/* <EditProfileButton /> */}
							<MyComponent title={"Edit your profile"} />
						</div>
						<p className="profile-location">📍 {accountData.location}</p>
					</div>
				</div>
				<div className="profile-about">
					<div className="profile-about-header">
						<h3>About</h3>
						<AboutEditButton />
					</div>
					<p className="profile-about-text">{`${about}`}</p>
				</div>
			</div>
		</UserProfileContext.Provider>
	)
}
