import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { usePageControls } from "../hooks/usePageControls";
import { GuestTier, type Guest } from "../interfaces/interfaces";
import { getAllGuests, type createGuest, type udpateGuest } from "../services/api";

export type GuestForm = {
    id: number | null,
    name: string
    passportNumber: string
    email: string
    tier: GuestTier | null
}

const EMPTY_FORM: GuestForm = { 
    id: null,
    name: '',
    passportNumber: '',
    email: '',
    tier: null
}
type CreateGuestData = Parameters<typeof createGuest>[0]
type UpdateGuestData = Parameters<typeof udpateGuest>[1]

export default function GuestsPage() {
    const { addToast } = useToast()
    const { isFormOpen, showForm, showFilterBar, isFilterBarOpen, clear } = usePageControls();

    const [allGuests, setAllGuests] = useState<Guest[]>([])
    
    const [newStaff, setNewStaff] = useState<GuestForm>(EMPTY_FORM)
    const [editing, setEditing] = useState<GuestForm | null>(null)
    
    useEffect(() => {
        const fetchData = async () => {
            const allGuestsRes = await getAllGuests()
            setAllGuests(allGuestsRes.data)
        }
        fetchData()
    }, [])

    return (
        <div>
            <div className="show-form-wrapper">
                <h2>Vendégek</h2>
                <button className="btn btn-primary" onClick={showForm}> ＋ </button>
                <button className="btn btn-ghost" onClick={clear}> ✕ </button>
            </div>
            <p className="page-desc">Vendégek regisztrálása, szerkesztése, törlése.</p>

            <div className="card-grid">
                {allGuests.map(guest => {
                    const isEditing = editing?.id === guest.id
                    return (
                        <div className="card" key={`guest-card-${guest.id}`}>
                            <div className="card-header">
                                <div className="card-name">{guest.name}</div>
                                <div className="card-meta">
                                    <span 
                                        className={`badge 
                                            ${GuestTier[guest.tier] === GuestTier.GOLD ? 'gold' : 
                                              GuestTier[guest.tier] === GuestTier.PLATINUM ? 'teal' :
                                              GuestTier[guest.tier] === GuestTier.SILVER ? 'silver' :
                                              'blue'
                                        }`}
                                        title="Beosztás"
                                    >
                                        {GuestTier[guest.tier]}
                                    </span>
                                    &nbsp;&nbsp;
                                    <span className="badge green" title="Foglalások száma">
                                        {guest.bookingCount}
                                    </span>
                                </div>
                            </div>
                            <div className="card-sub"><strong>Email:</strong> {guest.email}</div>
                            <div className="card-sub"><strong>Aktív foglalás:</strong></div>
                            {guest.activeBooking ? 
                                (<div className="card-sub" style={{display: 'flex', flexDirection: 'column'}}>
                                    <span>Szobaszám: <strong>{guest.activeBooking.roomNumber}</strong></span>
                                    <span>Foglalás kezdete: <strong>{guest.activeBooking.checkInDate.toString()}</strong></span>
                                    <span>Foglalás vége: <strong>{guest.activeBooking.checkOutDate.toString()}</strong></span>
                                </div>)
                                :
                                (<div className="card-sub">A vendégnek nincs még aktív foglalása</div>)
                            }

                            {/* {isEditing && <StaffFormFields
                                isEditing={true}
                                valueState={editing}
                                onUpdate={updateEditing}
                                onCreate={() => handleUpdate(staff.id)}
                                onClose={() => setEditing(null)}
                            />} */}

                            {/* <div className="card-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => startEditing(staff)}>✏️ Szerkesztés</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(staff.id)}>🗑 Törlés</button>
                            </div> */}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}