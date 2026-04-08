import type { WingForm } from "../pages/WingsPage";

interface WingFormFieldsProps {
    isEditing: boolean;
    valueState: WingForm | null;
    onUpdate: (field: keyof Omit<WingForm, 'id'>, value: string | null) => void;
    onCreate: () => void;
    onClose: () => void;
}

export const WingFormFields = ( { isEditing, valueState, onUpdate, onCreate, onClose } :WingFormFieldsProps ) => {
    return (
        <div className={isEditing ? 'form-row-editing' : 'form-row'}>
            <input 
                type="text"
                value={valueState?.name}
                placeholder="Szárny neve"
                onChange={e => onUpdate('name', e.target.value)}
            />
            <input 
                type="text"
                value={valueState?.managerName}
                placeholder="Manager neve"
                onChange={e => onUpdate('managerName', e.target.value)}
            />
            <input
                type="text"
                value={valueState?.description}
                placeholder="Szárny leírása"
                onChange={e => onUpdate('description', e.target.value)}
            />
            {isEditing ? 
                <div className="inline-edit">
                    <button className="btn btn-primary btn-sm" onClick={onCreate}>
                        ＋ Mentés
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        ✕
                    </button>
                </div>
            :
                <div style={{display: 'flex', gap: '5px'}}>
                    <button className="btn btn-primary btn-sm" onClick={onCreate}>
                        ＋ Létrehozás
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        ✕
                    </button>
                </div>
            }
        </div>
    )
}