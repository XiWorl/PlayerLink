import { AccountType, getAccountDataFromSessionStorage } from "../../utils/globalUtils"
import { CustomizableModal } from "../CustomizableModal/CustomizableModal"
import { ModalTextBox } from "../CustomizableModal/utils"
import { modalSubmitHelper } from "./EditButtonUtils"
import { useState, useContext } from "react"
import { UserProfileContext } from "./UserProfile"
export const TypeOfEditButton = {
	BIO: "bio",
	ABOUT: "about",
}

function onAboutModalSubmitButtonClicked(textValue) {
	const { setAbout, id } = useContext(UserProfileContext)
	return async function () {
		const updatedAboutObject = await modalSubmitHelper(
			textValue,
			TypeOfEditButton.ABOUT,
			AccountType.PLAYER,
			id
		)
		if (updatedAboutObject.updatedValue != null)
			setAbout(updatedAboutObject.updatedValue)
	}
}

function onBioModalSubmitButtonClicked(textValue) {
	const { setBio, id } = useContext(UserProfileContext)
	return async function () {
		const updatedBioObject = await modalSubmitHelper(
			textValue,
			TypeOfEditButton.BIO,
			AccountType.PLAYER,
			id
		)
		if (updatedBioObject.updatedValue != null) setBio(updatedBioObject.updatedValue)
	}
}

export function EditButtonTemplate({ detailType, onSubmitButtonClicked }) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const modalTitle =
		detailType === TypeOfEditButton.BIO ? "Edit Your Bio" : "Edit Your About"

	const textBox = (
		<ModalTextBox
			setIsModalOpen={setIsModalOpen}
			onSubmitButtonClicked={onSubmitButtonClicked}
		/>
	)

	return (
		<>
			<input
				type="image"
				src="/pen-to-square.png"
				className="profile-about-image"
				onClick={() => setIsModalOpen(!isModalOpen)}
			/>
			{isModalOpen && (
				<CustomizableModal
					components={[textBox]}
					title={modalTitle}
					setIsModalOpen={setIsModalOpen}
				/>
			)}
		</>
	)
}

export function AboutEditButton() {
	const { loggedInAccountData, id } = useContext(UserProfileContext)
	if (!loggedInAccountData || loggedInAccountData.id != id) return null

	return (
		<EditButtonTemplate
			detailType={TypeOfEditButton.ABOUT}
			onSubmitButtonClicked={onAboutModalSubmitButtonClicked}
		/>
	)
}

export function BioEditButton() {
	const { loggedInAccountData, id } = useContext(UserProfileContext)
	if (!loggedInAccountData || loggedInAccountData.id != id) return null

	return (
		<EditButtonTemplate
			detailType={TypeOfEditButton.BIO}
			onSubmitButtonClicked={onBioModalSubmitButtonClicked}
		/>
	)
}
