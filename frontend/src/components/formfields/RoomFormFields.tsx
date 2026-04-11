import { useWings } from "../../hooks/useWings";
import { RoomType } from "../../interfaces/interfaces";
import type { RoomForm } from "../../pages/RoomsPage";


interface RoomFormFieldsProps {
    isEditing: boolean;
    valueState: RoomForm | null;
    onUpdate: (field: keyof Omit<RoomForm, 'id'>, value: string | number | RoomType | null) => void;
    onCreate: () => void;
    onClose: () => void;
}

export const RoomFormFields = ( { isEditing, valueState, onUpdate, onCreate, onClose } :RoomFormFieldsProps ) => {
    const wings = useWings()
    return (
        <div className={isEditing ? 'form-row-editing' : 'form-row'}>
            <input 
                type="text"
                value={valueState?.roomNumber}
                placeholder="Szoba száma"
                onChange={e => onUpdate('roomNumber', e.target.value)}
            />
            <input 
                type="number"
                value={valueState?.pricePerNight ?? 10}
                placeholder="Szoba ára"
                onChange={e => onUpdate('pricePerNight', Number(e.target.value))}
            />
            <input 
                type="number"
                value={valueState?.capacity ?? 4}
                placeholder="Férőhelyek száma"
                onChange={e => onUpdate('capacity', Number(e.target.value))}
            />
            <select
                value={valueState?.roomType ?? ''}
                onChange={e => onUpdate('roomType', e.target.value)}
            >
                <option value="" disabled>Válassz típust...</option>
                {Object.entries(RoomType).map(([key, value]) => (
                    <option key={`roomtype-${key}`} value={key}>{value}</option>
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