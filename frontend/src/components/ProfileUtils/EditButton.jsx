import { getAccountDataFromSessionStorage } from "../../utils/globalUtils"
import { CustomizableModal } from "../CustomizableModal/CustomizableModal"
import { ModalTextBox } from "../CustomizableModal/utils"
import { useState } from "react"
export const TypeOfEditButton = {
	BIO: "bio",
	ABOUT: "about",
	OVERVIEW: "overview",
	DESCRIPTION: "description",
}

function EditButtonTemplate({ onSubmitButtonClicked, modalTitle }) {
	const [isModalOpen, setIsModalOpen] = useState(false)

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

function verifyUserOwnsProfile(id) {
	const accountData = getAccountDataFromSessionStorage()
	if (!accountData || id != getAccountDataFromSessionStorage().id) return false
	return true
}

export function EditProfileTextButton({ modalTitle, onSubmitButtonClicked, profileId }) {
	if (!verifyUserOwnsProfile(profileId)) return null

	return (
		<EditButtonTemplate
			onSubmitButtonClicked={onSubmitButtonClicked}
			modalTitle={modalTitle}
		/>
	)
}
