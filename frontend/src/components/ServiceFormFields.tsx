import DatePicker from "react-datepicker";
import { useGuests } from "../hooks/useGuests";
import { useStaff } from "../hooks/useStaff";
import { ServiceType } from "../interfaces/interfaces";
import type { ServiceForm } from "../pages/ServicesPage";


interface ServiceFormFieldsProps {
    valueState: ServiceForm | null;
    onUpdate: (field: keyof ServiceForm, value: string | number | Date | ServiceType | null) => void;
    onCreate: () => void;
    onClose: () => void;
}

export const ServiceFormFields = ({ valueState, onUpdate, onCreate, onClose } :ServiceFormFieldsProps) => {
    const guests = useGuests()
    const staff = useStaff()
    return (
        <div className='form-row'>
            <select
                value={valueState?.guestId ?? ''}
                onChange={e => onUpdate('guestId', Number(e.target.value))}
            >
                <option value="" disabled>Válassz vendéget...</option>
                {guests.map(guest => (
                    <option key={`guest-${guest.id}`} value={guest.id}>{guest.name}</option>
                ))}
            </select>
            <select
                value={valueState?.staffId ?? ''}
                onChange={e => onUpdate('staffId', Number(e.target.value))}
            >
                <option value="" disabled>Válassz személyzetet...</option>
                {staff.map(s => (
                    <option key={`staff-${s.id}`} value={s.id}>{s.name}</option>
                ))}
            </select>
            <DatePicker
                placeholderText="Kérés dátuma"
                dateFormat="yyyy.MM.dd"
                selected={valueState?.requestDate} 
                onChange={(date: Date | null) => onUpdate('requestDate', date)} 
                className="date-picker"
            />
            <select
                value={valueState?.type ?? ''}
                onChange={e => onUpdate('type', e.target.value)}
            >
                <option value="" disabled>Válassz típust...</option>
                {Object.entries(ServiceType).map(([key, value]) => (
                    <option key={`type-${key}`} value={key}>{value}</option>
                ))}
            </select>
            <input 
                type="text"
                value={valueState?.description}
                placeholder="Leírás..."
                onChange={e => onUpdate('description', e.target.value)}
            />

            <div style={{display: 'flex', gap: '5px'}}>
                <button className="btn btn-primary btn-sm" onClick={onCreate}>
                    ＋ Létrehozás
                </button>
                <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        ✕
                </button>
            </div>

        </div>
    )
}