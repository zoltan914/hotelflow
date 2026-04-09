import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { usePageControls } from "../hooks/usePageControls";
import { GuestTier, type Guest } from "../interfaces/interfaces";
import { createGuest, deleteGuest, getAllGuests, udpateGuest } from "../services/api";
import { GuestFormFields } from "../components/GuestFormFields";

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
    
    const [newGuest, setNewGuest] = useState<GuestForm>(EMPTY_FORM)
    const [editing, setEditing] = useState<GuestForm | null>(null)
    
    const updateNew = (field: keyof GuestForm, value: string | number | GuestTier | null) => {
        setNewGuest(prev => ({ ...prev, [field]: value }))
    }
    const updateEditing = (field: keyof Omit<GuestForm, 'id'>, value: string | number | GuestTier | null) =>
        setEditing(prev => prev ? { ...prev, [field]: value } : null)

    const startEditing = (p: Guest) =>
        setEditing({ id: p.id, name: p.name, passportNumber: p.passportNumber, email: p.email, tier: p.tier as GuestTier })

    useEffect(() => {
        const fetchData = async () => {
            const allGuestsRes = await getAllGuests()
            setAllGuests(allGuestsRes.data)
        }
        fetchData()
    }, [])

    const handleCreate = async () => {
        if (!newGuest.name.trim() || !newGuest.email.trim() || !newGuest.passportNumber.trim() || !newGuest.tier ) {
            addToast('Az összes mező kitöltése kötelező!', 'error');
            return
        }
        try {
            const createdGuest = await createGuest(newGuest as CreateGuestData)
            setAllGuests(prev => [...prev, createdGuest.data])
            addToast('A vendég sikeresen létrehozva');
            setNewGuest(EMPTY_FORM)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    const handleUpdate = async (guestId: number) => {
        if (!editing) return
        try {
            const {id, ...updateData} = editing
            const updatedGuest = await udpateGuest(guestId, updateData as UpdateGuestData)
            setAllGuests(prev => prev.map(d => d.id === guestId ? updatedGuest.data : d))
            addToast('A vendég adatai sikeresen frissítve')
            setEditing(null)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretnéd ezt a személyzetet?')) return
        try {
            await deleteGuest(id)
            setAllGuests(prev => prev.filter(d => d.id !== id))
            addToast('A vendég sikeresen törölve')
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Hiba történt a törlés során', 'error')
        }
    }

    return (
        <div>
            <div className="show-form-wrapper">
                <h2>Vendégek</h2>
                <button className="btn btn-primary" onClick={showForm}> ＋ </button>
                <button className="btn btn-ghost" onClick={() => {
                    clear()
                    setEditing(null)
                }}> ✕ </button>
            </div>
            <p className="page-desc">Vendégek regisztrálása, szerkesztése, törlése.</p>

             {isFormOpen && <GuestFormFields
                isEditing={false}
                valueState={newGuest}
                onUpdate={updateNew}
                onCreate={handleCreate}
                onClose={clear}
            />}

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
                                (<div className="card-sub">A vendégnek nincs aktív foglalása</div>)
                            }

                            {isEditing && <GuestFormFields
                                isEditing={true}
                                valueState={editing}
                                onUpdate={updateEditing}
                                onCreate={() => handleUpdate(guest.id)}
                                onClose={() => setEditing(null)}
                            />}

                            <div className="card-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => startEditing(guest)}>✏️ Szerkesztés</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(guest.id)}>🗑 Törlés</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}