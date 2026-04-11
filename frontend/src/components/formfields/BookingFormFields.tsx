import DatePicker from "react-datepicker";
import { useGuests } from "../../hooks/useGuests";
import { useRooms } from "../../hooks/useRooms";
import type { BookingForm } from "../../pages/BookingsPage";


interface WingFormFieldsProps {
    valueState: BookingForm | null;
    onUpdate: (field: keyof BookingForm, value: string | number | Date | null) => void;
    onCreate: () => void;
    onClose: () => void;
}


export const BookingFormFields = ({ valueState, onUpdate, onCreate, onClose } :WingFormFieldsProps) => {
    const guests = useGuests()
    const rooms = useRooms()
    return (
        <div className="form-row">
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
                value={valueState?.roomId ?? ''}
                onChange={e => onUpdate('roomId', Number(e.target.value))}
            >
                <option value="" disabled>Válassz szobát...</option>
                {rooms.map(room => (
                    <option key={`guest-${room.id}`} value={room.id}>{room.roomNumber} - {room.roomType}</option>
                ))}
            </select>
            <DatePicker
                placeholderText="Bejelentkezés dátuma"
                dateFormat="yyyy.MM.dd"
                selected={valueState?.checkInDate} 
                onChange={(date: Date | null) => onUpdate('checkInDate', date)} 
                className="date-picker"
            />
            <DatePicker
                placeholderText="Kijelentkezés dátuma"
                dateFormat="yyyy.MM.dd"
                selected={valueState?.checkOutDate} 
                onChange={(date: Date | null) => onUpdate('checkOutDate', date)} 
                className="date-picker"
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