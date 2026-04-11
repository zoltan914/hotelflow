import { GuestTier } from "../../interfaces/interfaces";
import type { GuestForm } from "../../pages/GuestsPage";


interface WingFormFieldsProps {
    isEditing: boolean;
    valueState: GuestForm | null;
    onUpdate: (field: keyof Omit<GuestForm, 'id'>, value: string | number | GuestTier | null) => void;
    onCreate: () => void;
    onClose: () => void;
}

export const GuestFormFields = ( { isEditing, valueState, onUpdate, onCreate, onClose } :WingFormFieldsProps ) => {
    return (
        <div className={isEditing ? 'form-row-editing' : 'form-row'}>
            <input 
                type="text"
                value={valueState?.name}
                placeholder="Vendég neve"
                onChange={e => onUpdate('name', e.target.value)}
            />
            <input 
                type="text"
                value={valueState?.email}
                placeholder="Vendég email címe"
                onChange={e => onUpdate('email', e.target.value)}
            />
            <input 
                type="text"
                value={valueState?.passportNumber}
                placeholder="Vendég útlevél száma"
                onChange={e => onUpdate('passportNumber', e.target.value)}
            />
            <select
                value={valueState?.tier ?? ''}
                onChange={e => onUpdate('tier', e.target.value)}
            >
                <option value="" disabled>Válassz tagságot...</option>
                {Object.entries(GuestTier).map(([key, value]) => (
                    <option key={`tier-${key}`} value={key}>{value}</option>
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