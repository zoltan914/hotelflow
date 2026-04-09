import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { usePageControls } from "../hooks/usePageControls";
import { RoomType, type Room, type Wing } from "../interfaces/interfaces";
import { getAllRooms, getAllWings, type createRoom, type udpateRoom } from "../services/api";


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
    const { isFormOpen, showForm, clear } = usePageControls();

    const [allRooms, setAllRooms] = useState<Room[]>([])
    const [allWings, setAllWings] = useState<Wing[]>([])

    const [newRoom, setNewRoom] = useState<RoomForm>(EMPTY_FORM)
    const [editing, setEditing] = useState<RoomForm | null>(null)
    
        
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
                <button className="btn btn-ghost" onClick={() => {
                    clear()
                    setEditing(null)
                }}> ✕ </button>
            </div>
            <p className="page-desc">Szobák regisztrálása, szerkesztése, törlése.</p>

            <div className="card-grid">
                {allRooms.map(room => {
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
                            <div className="card-sub"><strong>Vendégek száma: </strong> 
                                {room.bookedNightsCount}
                            </div>
                            
                            {/*
                            {isEditing && <StaffFormFields
                                isEditing={true}
                                valueState={editing}
                                onUpdate={updateEditing}
                                onCreate={() => handleUpdate(staff.id)}
                                onClose={() => setEditing(null)}
                            />}

                            <div className="card-actions">
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