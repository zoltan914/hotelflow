import React, { useEffect, useState } from "react"
import { cancel, checkIn, checkOut, createBooking, createReview, getAllBookings, getAllGuests, getAllRooms, getAllWings } from "../services/api"
import { BookingStatus, type ApiResponse, type Booking, type Guest, type Room, type Wing } from "../interfaces/interfaces"
import { useToast } from "../context/ToastContext";
import { TableSeparator } from "../components/TableSeparator";
import { usePageControls } from "../hooks/usePageControls";
import { BookingFormFields } from "../components/BookingFormFields";
import { toLocalDateString } from "../utils/dateutils";

const star = "⭐";

enum Ops {
    CHECK_IN, CHECK_OUT, CANCEL
}

const operationMap: Record<Ops, (id: number) => ApiResponse<Booking>> = {
    [Ops.CHECK_IN]: checkIn,
    [Ops.CHECK_OUT]: checkOut,
    [Ops.CANCEL]: cancel,
};

export type BookingForm = {
    guestId: number | null,
    roomId: number | null,
    checkInDate: Date | null,
    checkOutDate: Date | null
}

const EMPTY_BOOKING_FORM : BookingForm = {
    guestId: null,
    roomId: null,
    checkInDate: null,
    checkOutDate: null
}

type ReviewForm = {
    stars: number,
    comment: string,
    specialRequests: string
}

const EMPTY_REVIEW_FORM: ReviewForm = { 
    stars: 5,
    comment: '',
    specialRequests: ''
}

export default function BookingsPage() {
    const { addToast } = useToast()
    const { isFormOpen, showForm, clear } = usePageControls();
    
    const [allBookings, setAllBookings] = useState<Booking[]>([])
    const [allRooms, setAllRooms] = useState<Room[]>([])
    const [allWings, setAllWings] = useState<Wing[]>([])
    const [allGuests, setAllGuests] = useState<Guest[]>([])

    const [selectedId, setSelectedId] = useState<number | null>(null)

    const [newRievew, setNewReview] = useState<ReviewForm>(EMPTY_REVIEW_FORM)
    const updateNewReview = (field: keyof ReviewForm, value: string | number | null) => {
        setNewReview(prev => ({ ...prev, [field]: value }))
    }

    const [newBooking, setNewBooking] = useState<BookingForm>(EMPTY_BOOKING_FORM)
    const updateNewBooking = (field: keyof BookingForm, value: string | number | Date | null) => {
        setNewBooking(prev => ({ ...prev, [field]: value}))
    }
  
    useEffect(() => {
        const fetchData = async () => {
            const [bookingsRes, roomsRes, wingsRes, guestRes] 
                    = await Promise.all([getAllBookings(), getAllRooms(), getAllWings(), getAllGuests()])
            setAllBookings(bookingsRes.data)
            setAllRooms(roomsRes.data)
            setAllWings(wingsRes.data)
            setAllGuests(guestRes.data)
        }
        fetchData()
    }, [])

    const handleOperations = async (bookingId: number, key: Ops) => {
        if (!bookingId || !operationMap[key]) return;
        try {
            const bookingResponse = await operationMap[key](bookingId);
            setAllBookings(prev => prev.map(d => d.id === bookingId ? bookingResponse.data : d))
            addToast('A foglalás adatai sikeresen frissítve')
            setSelectedId(null)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    const handleCreateReview = async (bookingId: number) => {
        if (!newRievew.stars) {
            addToast('A csillagok számának megadása kötelező!', 'error');
            return
        }
        try {
            const createdReview = await createReview(bookingId, newRievew)
            setAllBookings(prev => prev.map(d => d.id === bookingId ? {...d, review: createdReview.data} : d))
            addToast('Az értékelés sikeresen elküldve')
            setSelectedId(null)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    
    const handleCreateBooking = async () => {
        if (!newBooking.roomId || !newBooking.guestId || !newBooking.checkInDate) {
            addToast('A mezők kitöltése kötelező!', 'error');
            return
        }
        try {
            const createdBooking = await createBooking({
                ...newBooking,
                checkInDate: new Date(toLocalDateString(newBooking.checkInDate)),
                checkOutDate: newBooking.checkOutDate ? new Date(toLocalDateString(newBooking.checkOutDate)) : null
            })
            setAllBookings(prev => [...prev, createdBooking.data])
            addToast('A foglalás sikeres');
            setNewBooking(EMPTY_BOOKING_FORM)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }


    return (
        <div>
            <div className="show-form-wrapper">
                <h2>Foglalások</h2>
                <button className="btn btn-primary" onClick={showForm}> ＋ </button>
                <button className="btn btn-ghost" onClick={() => {
                    clear()
                    setSelectedId(null)
                }}> ✕ </button>
            </div>
            <p className="page-desc">Foglalások felvétele, értékelés hozzáadása, státusz műveletek.</p>

            {isFormOpen && <BookingFormFields
                valueState={newBooking}
                onUpdate={updateNewBooking}
                onCreate={handleCreateBooking}
                onClose={clear}
            />}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Vendég</th>
                            <th>Szoba</th>
                            <th>Szárny</th>
                            <th>Értékelés</th>
                            <th>Bejelentkezés</th>
                            <th>Kijelentkezés</th>
                            <th>Státusz</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.PENDING).map(booking => {
                            return (
                                <tr key={`booking-row-${booking.id}`}>
                                    <td className="bold">{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td></td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate?.toString()}</td>
                                    <td><span className="table-badge red">{BookingStatus[booking.status]}</span></td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleOperations(booking.id, Ops.CHECK_IN)}>Bejelentkezés</button>
                                        <button style={{marginLeft: '10px'}} className="btn btn-primary" onClick={() => handleOperations(booking.id, Ops.CANCEL)}>Lemondás</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <TableSeparator />
                    
                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.ACTIVE).map(booking => {
                            return (
                                <tr key={`booking-row-${booking.id}`}>
                                    <td className="bold">{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td></td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate?.toString()}</td>
                                    <td><span className="table-badge gold">{BookingStatus[booking.status]}</span></td>
                                    <td><button className="btn btn-primary" onClick={() => handleOperations(booking.id, Ops.CHECK_OUT)}>Kijelentkezés</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <TableSeparator />

                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.CHECKED_OUT).map(booking => {
                            const isReviewOpen = selectedId === booking?.id
                            return (
                                <React.Fragment key={`checked-out-${booking.id} `}>
                                    <tr 
                                      key={`booking-row-${booking.id}`} 
                                      style={{cursor: booking?.review ? 'pointer' : ''}}
                                      onClick={() => {
                                          if (!booking.review) return;
                                          if (selectedId === booking.id) {
                                            setSelectedId(null)
                                          } else {
                                            setSelectedId(booking.id)
                                          }
                                        }}
                                      >
                                        <td className="bold">{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                        <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                        <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                        <td>
                                            {booking.review ? star.repeat(booking.review.stars) : ''}
                                        </td>
                                        <td>{booking.checkInDate.toString()}</td>
                                        <td>{booking.checkOutDate?.toString()}</td>
                                        <td><span className="table-badge green">{BookingStatus[booking.status]}</span></td>
                                        <td>{!booking.review && <button className="btn btn-primary" onClick={() => setSelectedId(booking.id)}>Értékelés</button>}</td>
                                    </tr>
                                    {isReviewOpen ? booking.review ?
                                        <tr className="review-block">
                                            <td colSpan={5}><strong>Megjegyzés:  </strong>{booking.review.comment}</td>
                                            <td colSpan={3}><strong>Speciális:  </strong>{booking.review.specialRequests}</td>
                                        </tr>
                                        :
                                        <>
                                            <tr className="review-block">
                                                <td className="rating-display" colSpan={2} >
                                                    <label>Csillagok</label>
                                                    <input 
                                                        type="number"
                                                        max={5}
                                                        min={1}
                                                        value={newRievew?.stars}
                                                        onChange={e => updateNewReview('stars', Number(e.target.value))}
                                                    />
                                                </td>
                                                <td className="review-comment" colSpan={3}>
                                                    <label>Mejegyzés</label>
                                                    <textarea
                                                        value={newRievew?.comment}
                                                        onChange={e => updateNewReview('comment', e.target.value)}
                                                    />
                                                </td>
                                                <td className="review-requests" colSpan={3}>
                                                    <label>Speciális kérések</label>
                                                    <textarea 
                                                        value={newRievew?.specialRequests}
                                                        onChange={e => updateNewReview('specialRequests', e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr className="review-block">
                                                <td colSpan={8}>
                                                    <button className="btn btn-primary" onClick={() => handleCreateReview(booking.id)}
                                                        style={{marginRight: '10px'}}>Mentés</button>
                                                    <button className="btn btn-primary" onClick={() => setSelectedId(null)}>
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                        </>
                                        :<></>
                                    }
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                    <TableSeparator />

                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.CANCELLED).map(booking => {
                            return (
                                <tr key={`booking-row-${booking.id}`}>
                                    <td className="bold">{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td></td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate?.toString()}</td>
                                    <td><span className="table-badge silver">{BookingStatus[booking.status]}</span></td>
                                    <td></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
        </div>
    )
}