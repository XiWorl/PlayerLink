import { CustomizableModal } from "./CustomizableModal"
import { useState } from "react"
export const EditType = {
	BIO: "bio",
	ABOUT: "about",
}

function onAboutClick() {
	return <CustomizableModal />
}

export function EditButton() {
	const [isModalOpen, setIsModalOpen] = useState(false)
	return (
		<>
			<input
				type="image"
				src="/pen-to-square.png"
				className="profile-about-image"
				onClick={() => setIsModalOpen(!isModalOpen)}
			></input>
			<CustomizableModal />
		</>
	)
}
