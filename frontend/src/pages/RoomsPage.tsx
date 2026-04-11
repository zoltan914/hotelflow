import { useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";
import { usePageControls } from "../hooks/usePageControls";
import { RoomType, type Room, type Wing } from "../interfaces/interfaces";
import { createRoom, deleteRoom, getAllRooms, getAllWings, udpateRoom } from "../services/api";
import { RoomFormFields } from "../components/formfields/RoomFormFields";


export type RoomForm = {
    id: number | null,
    roomNumber: string,
    wingId: number | null,
    roomType: RoomType | null,
    pricePerNight: number | null,
    capacity: number | null
}

const EMPTY_FORM: RoomForm = { 
    id: null,
    roomNumber: '',
    wingId: null,
    roomType: null,
    pricePerNight: null,
    capacity: null
}
type CreateRoomData = Parameters<typeof createRoom>[0]
type UpdateRoomData = Parameters<typeof udpateRoom>[1]


export default function RoomsPage() {
    const { addToast } = useToast()
    const { isFormOpen, showForm, clear, showFilterBar, isFilterBarOpen } = usePageControls();

    const [allRooms, setAllRooms] = useState<Room[]>([])
    const [allWings, setAllWings] = useState<Wing[]>([])

    const [newRoom, setNewRoom] = useState<RoomForm>(EMPTY_FORM)
    const [editing, setEditing] = useState<RoomForm | null>(null)

    const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null)
    const [selectedWingId, setSelectedWingId] = useState<number | null>(null)
    
        
    const updateNew = (field: keyof RoomForm, value: string | number | RoomType | null) => {
        setNewRoom(prev => ({ ...prev, [field]: value }))
    }
    const updateEditing = (field: keyof Omit<RoomForm, 'id'>, value: string | number | RoomType | null) =>
        setEditing(prev => prev ? { ...prev, [field]: value } : null)

    const startEditing = (p: Room) =>
        setEditing({ id: p.id, roomNumber: p.roomNumber, wingId: p.wingId,
                 roomType: p.roomType as RoomType, pricePerNight: p.pricePerNight, capacity: p.capacity })

    useEffect(() => {
        const fetchData = async () => {
            const [allRoomsRes, allWingsRes] = await Promise.all([getAllRooms(), getAllWings()])
            setAllRooms(allRoomsRes.data)
            setAllWings(allWingsRes.data)
        }
        fetchData()
    }, [])


    const filteredRooms = useMemo(() => {
        return allRooms
                .filter(r => !selectedWingId || r.wingId === selectedWingId)
                .filter(r => !selectedRoomType || r.roomType === selectedRoomType as any)
    }, [allRooms, selectedWingId, selectedRoomType])


    const handleCreate = async () => {
        if (!newRoom.roomNumber.trim() || !newRoom.pricePerNight || !newRoom.capacity || !newRoom.roomType || !newRoom.wingId ) {
            addToast('Az összes mező kitöltése kötelező!', 'error');
            return
        }
        try {
            const createdRoom = await createRoom(newRoom as CreateRoomData)
            setAllRooms(prev => [...prev, createdRoom.data])
            addToast('A szoba sikeresen létrehozva');
            setNewRoom(EMPTY_FORM)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    const handleUpdate = async (roomId: number) => {
        if (!editing) return
        try {
            const {id, ...updateData} = editing
            const updatedRoom = await udpateRoom(roomId, updateData as UpdateRoomData)
            setAllRooms(prev => prev.map(d => d.id === roomId ? updatedRoom.data : d))
            addToast('A szoba adatai sikeresen frissítve')
            setEditing(null)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretnéd ezt a szobát?')) return
        try {
            await deleteRoom(id)
            setAllRooms(prev => prev.filter(d => d.id !== id))
            addToast('A szoba sikeresen törölve')
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Hiba történt a törlés során', 'error')
        }
    }


    const getCapacityFillColor = (currentCapacity : number) => {
        return  currentCapacity >= 100 ? 'full':
                currentCapacity >= 90 ? 'danger':
                currentCapacity >= 80 ? 'warning':
                ''
    }   

    return (
        <div>
            <div className="show-form-wrapper">
                <h2>Szobák</h2>
                <button className="btn btn-primary" onClick={showForm}> ＋ </button>
                <button className="btn btn-ghost" onClick={showFilterBar}><span>🔍</span></button>
                <button className="btn btn-ghost" onClick={() => {
                    clear()
                    setEditing(null)
                }}> ✕ </button>
            </div>
            <p className="page-desc">Szobák regisztrálása, szerkesztése, törlése.</p>
            
            {isFormOpen && <RoomFormFields
                isEditing={false}
                valueState={newRoom}
                onUpdate={updateNew}
                onCreate={handleCreate}
                onClose={clear}
            />}

            {isFilterBarOpen &&
                <div className="filter-controls">
                    <div className="filter-bar">
                        <div className="elem">
                            <div className={`filter-chip ${selectedRoomType === null ? 'active' : ''}`} onClick={() => setSelectedRoomType(null)}>Összes</div>
                            {Object.entries(RoomType).map(([key, value]) => {
                                const roomType = Object.keys(RoomType).find(o => o === key) as RoomType
                                return (
                                    <div 
                                        key={`filter-roomtype-${key}`} 
                                        className={`filter-chip ${selectedRoomType === roomType ? 'active' : ''}`} 
                                        onClick={() => setSelectedRoomType(roomType)}
                                    >
                                        {value}
                                    </div>
                            )})}
                        </div>
                        <div className="elem">
                            <div className={`filter-chip ${selectedWingId === null ? 'active' : ''}`} onClick={() => setSelectedWingId(null)}>Összes</div>
                            {allWings.map(wing => 
                                <div 
                                    key={`filter-wing-${wing.id}`} 
                                    className={`filter-chip ${selectedWingId === wing.id ? 'active' : ''}`} 
                                    onClick={() => setSelectedWingId(wing.id)}
                                >
                                    {wing.name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }


            <div className="card-grid">
                {filteredRooms.map(room => {
                    const isEditing = editing?.id === room.id
                    const currentCapacity = Math.min(Math.round(room.bookedNightsCount / room.capacity * 100), 100)
                    return (
                        <div className="card" key={`room-card-${room.id}`}>
                            <div className="card-header">
                                <div className="card-name">{room.roomNumber}</div>
                                <div className="card-meta">
                                    <span 
                                        className={`badge 
                                            ${RoomType[room.roomType] === RoomType.PENTHOUSE ? 'gold' : 
                                                RoomType[room.roomType] === RoomType.SUITE ? 'silver' :
                                                RoomType[room.roomType] === RoomType.DELUXE ? 'teal' :
                                                'blue'
                                        }`}
                                        title="Szoba típusa"
                                    >
                                        {RoomType[room.roomType]}
                                    </span>
                                    &nbsp;&nbsp;
                                    <span className="badge gold" title="Szárny">
                                        <span>Ár/éj</span>{room.pricePerNight} Ft
                                    </span>
                                </div>
                            </div>
                            <div className="card-sub"><strong>Szárny: </strong> 
                                {allWings.find(w => w.id === room.wingId)?.name}
                            </div>
                            <div className="capacity-bar-wrapper">
                                <div className="capacity-label"> 
                                    {`Telítettség: ${currentCapacity}%`}
                                </div>
                                <div className="capacity-bar">
                                    <div 
                                        className={`capacity-bar-fill ${getCapacityFillColor(currentCapacity)}`}
                                        style={{ '--fill-width': `${currentCapacity}%` } as React.CSSProperties}
                                    >
                                    </div>
                                </div>
                            </div>
                            <div className="card-sub"><strong>Max férőhely: </strong> 
                                {room.capacity}
                            </div>
                            <div className="card-sub"><strong>Foglalások száma: </strong> 
                                {room.bookedNightsCount}
                            </div>
                            
                            
                            {isEditing && <RoomFormFields
                                isEditing={true}
                                valueState={editing}
                                onUpdate={updateEditing}
                                onCreate={() => handleUpdate(room.id)}
                                onClose={() => setEditing(null)}
                            />}

                            <div className="card-actions">
                                <button className="btn btn-ghost btn-sm" onClick={() => startEditing(room)}>✏️ Szerkesztés</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(room.id)}>🗑 Törlés</button>
                            </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}