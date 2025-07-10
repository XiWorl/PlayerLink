import { useContext } from "react"
import { UserInfoModalContext } from "./ModalBody.jsx"
import {
    TextFormField,
    LocationDropdown,
    YesOrNoDropdown,
    ExperienceDropdown,
    PlayStyleDropdown,
    GamesSelection,
    DEFAULT_FORM_VALUE,
} from "./ComponentUtils.jsx"

const optionalFields = ["lastName"]

function validateForm(formData, setFormErrors, onSubmit, handleClose) {
    return function (event) {
        event.preventDefault()

        let isFormValid = true
        const newErrors = {}

        for (const key in formData) {
            if (key === "gamesPlayed" || key === "gameUsernames") continue

            const inputValue =
                typeof formData[key] === "string" ? formData[key].trim() : formData[key]

            if (inputValue === DEFAULT_FORM_VALUE) {
                if (optionalFields.includes(key)) continue
                newErrors[key] = `${key} is required`
                isFormValid = false
            }
        }

        if (formData.gamesPlayed.length === 0) {
            newErrors.gamesPlayed = "Please select at least one game"
            isFormValid = false
        }

        setFormErrors(newErrors)

        if (isFormValid) {
            onSubmit(formData)
            handleClose()
        }

        return isFormValid
    }
}

export default function UserInfoForm({ onClose, onSubmit }) {
    const { formData, setFormErrors, handleClose } = useContext(UserInfoModalContext)

    return (
        <form
            onSubmit={validateForm(formData, setFormErrors, onSubmit, handleClose)}
            className="signup-form"
        >
            <TextFormField
                title="First Name"
                isRequired={true}
                elementName="firstName"
                placeholder="Enter your first name"
            />

            <TextFormField
                title="Last Name"
                isRequired={false}
                elementName="lastName"
                placeholder="Enter your last name (optional)"
            />

            <LocationDropdown />

            <YesOrNoDropdown
                title="Willing to Relocate"
                elementName="willingToRelocate"
            />

            <ExperienceDropdown />

            <GamesSelection />

            <PlayStyleDropdown />

            <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </div>
        </form>
    )
}
