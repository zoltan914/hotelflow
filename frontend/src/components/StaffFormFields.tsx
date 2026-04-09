import { useWings } from "../hooks/useWings";
import { StaffRole } from "../interfaces/interfaces";
import type { StaffForm } from "../pages/StaffPage";

interface WingFormFieldsProps {
    isEditing: boolean;
    valueState: StaffForm | null;
    onUpdate: (field: keyof Omit<StaffForm, 'id'>, value: string | number | StaffRole | null) => void;
    onCreate: () => void;
    onClose: () => void;
}

export const StaffFormFields = ( { isEditing, valueState, onUpdate, onCreate, onClose } :WingFormFieldsProps ) => {
    const wings = useWings()
    return (
        <div className={isEditing ? 'form-row-editing' : 'form-row'}>
            <input 
                type="text"
                value={valueState?.name}
                placeholder="Személyzet neve"
                onChange={e => onUpdate('name', e.target.value)}
            />
            <input 
                type="text"
                value={valueState?.email}
                placeholder="Személyzet email címe"
                onChange={e => onUpdate('email', e.target.value)}
            />
            <select
                value={valueState?.role ?? ''}
                onChange={e => onUpdate('role', e.target.value)}
            >
                <option value="" disabled>Válassz beosztást...</option>
                {Object.entries(StaffRole).map(([key, value]) => (
                    <option key={`role-${key}`} value={key}>{value}</option>
                ))}
            </select>
            <select
                value={valueState?.wingId ?? ''}
                onChange={e => onUpdate('wingId', Number(e.target.value))}
            >
                <option value="" disabled>Válassz szárnyat...</option>
                {wings.map(wing => (
                    <option key={`wing-${wing.id}`} value={wing.id}>{wing.name}</option>
                ))}
            </select>
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
