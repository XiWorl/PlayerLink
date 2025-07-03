import { CustomizableModal, ModalHeader } from "../CustomizableModal/CustomizableModal"
import { ModalTextBox } from "../CustomizableModal/utils"
import { modalSubmitHelper } from "./EditButtonUtils"
import { useState } from "react"
export const TypeOfEditButton = {
	BIO: "bio",
	ABOUT: "about",
}

function onAboutModalSubmitButtonClicked(textValue) {
	return function () {
		modalSubmitHelper(textValue, TypeOfEditButton.ABOUT)
	}
}
function onBioModalSubmitButtonClicked(textValue) {
	return function () {
		modalSubmitHelper(textValue, TypeOfEditButton.BIO)
	}
}

export function EditButtonTemplate({ detailType, onSubmitButtonClicked }) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const modalTitle =
		detailType === TypeOfEditButton.BIO ? "Edit Your Bio" : "Edit Your About"

	const header = <ModalHeader title={modalTitle} setIsModalOpen={setIsModalOpen} />
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
			{isModalOpen && <CustomizableModal components={[header, textBox]} />}
		</>
	)
}

export function AboutEditButton() {
	return (
		<EditButtonTemplate
			detailType={TypeOfEditButton.ABOUT}
			onSubmitButtonClicked={onAboutModalSubmitButtonClicked}
		/>
	)
}

export function BioEditButton() {
	return (
		<EditButtonTemplate
			detailType={TypeOfEditButton.BIO}
			onSubmitButtonClicked={onBioModalSubmitButtonClicked}
		/>
	)
}
