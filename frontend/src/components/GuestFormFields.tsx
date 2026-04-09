import type { GuestTier } from "../interfaces/interfaces";
import type { GuestForm } from "../pages/GuestsPage";


interface WingFormFieldsProps {
    isEditing: boolean;
    valueState: GuestForm | null;
    onUpdate: (field: keyof Omit<GuestForm, 'id'>, value: string | number | GuestTier | null) => void;
    onCreate: () => void;
    onClose: () => void;
}

export const StaffFormFields = ( { isEditing, valueState, onUpdate, onCreate, onClose } :WingFormFieldsProps ) => {
    return (
        <div></div>
    )
}