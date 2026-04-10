import { useEffect, useMemo, useState } from "react"
import { cancel, checkIn, checkOut, createReview, getAllBookings, getAllGuests, getAllRooms, getAllWings, updateReview } from "../services/api"
import { BookingStatus, type Booking, type Guest, type Room, type Wing } from "../interfaces/interfaces"
import { useToast } from "../context/ToastContext";

const star = "⭐";

export type ReviewForm = {
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
    
    const [allBookings, setAllBookings] = useState<Booking[]>([])
    const [allRooms, setAllRooms] = useState<Room[]>([])
    const [allWings, setAllWings] = useState<Wing[]>([])
    const [allGuests, setAllGuests] = useState<Guest[]>([])

    const [selectedId, setSelectedId] = useState<number | null>(null)

    const [newRievew, setNewReview] = useState<ReviewForm>(EMPTY_REVIEW_FORM)
    const updateNewReview = (field: keyof ReviewForm, value: string | number | null) => {
        setNewReview(prev => ({ ...prev, [field]: value }))
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

    const handleCheckIn = async (bookingId: number) => {
        if (!bookingId) return
        try {
            const checkedInBooking = await checkIn(bookingId)
            setAllBookings(prev => prev.map(d => d.id === bookingId ? checkedInBooking.data : d))
            addToast('A foglalás adatai sikeresen frissítve')
            setSelectedId(null)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    const handleCheckOut = async (bookingId: number) => {
        if (!bookingId) return
        try {
            const checkedOutBooking = await checkOut(bookingId)
            setAllBookings(prev => prev.map(d => d.id === bookingId ? checkedOutBooking.data : d))
            addToast('A foglalás adatai sikeresen frissítve')
            setSelectedId(null)
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Nem sikerült menteni a változásokat', 'error')
        }
    }

    const handleCancel = async (bookingId: number) => {
        if (!bookingId) return
        try {
            const cancelledBooking = await cancel(bookingId)
            setAllBookings(prev => prev.map(d => d.id === bookingId ? cancelledBooking.data : d))
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

    const Separator = () => {
        return (
            <tbody>
                <tr>
                    <td colSpan={8} style={{ padding: '0' }}>
                        <div style={{ borderTop: '3px solid var(--border-dark)', margin: '0' }} />
                    </td>
                </tr>
            </tbody>
        )
    }

    return (
        <div>
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
                                    <td>{booking.checkOutDate.toString()}</td>
                                    <td><span className="table-badge red">{BookingStatus[booking.status]}</span></td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => handleCheckIn(booking.id)}>Bejelentkezés</button>
                                        <button style={{marginLeft: '10px'}} className="btn btn-primary" onClick={() => handleCancel(booking.id)}>Lemondás</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <Separator />
                    
                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.ACTIVE).map(booking => {
                            return (
                                <tr key={`booking-row-${booking.id}`}>
                                    <td className="bold">{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td></td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate.toString()}</td>
                                    <td><span className="table-badge gold">{BookingStatus[booking.status]}</span></td>
                                    <td><button className="btn btn-primary" onClick={() => handleCheckOut(booking.id)}>Kijelentkezés</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                    <Separator />

                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.CHECKED_OUT).map(booking => {
                            const isReviewOpen = selectedId === booking?.id
                            return (
                                <>
                                    <tr key={`booking-row-${booking.id}`}>
                                        <td className="bold">{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                        <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                        <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                        <td 
                                          style={{cursor: booking?.review ? 'pointer' : 'not-allowed'}}
                                          onClick={() => {
                                            if (!booking.review) return;
                                            if (selectedId === booking.id) {
                                                setSelectedId(null)
                                            } else {
                                                setSelectedId(booking.id)
                                            }
                                          }}
                                        >
                                            {booking.review ? star.repeat(booking.review.stars) : ''}
                                        </td>
                                        <td>{booking.checkInDate.toString()}</td>
                                        <td>{booking.checkOutDate.toString()}</td>
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
                                                    <button className="btn btn-primary" onClick={() => handleCreateReview(booking.id)}>Mentés</button>
                                                </td>
                                            </tr>
                                        </>
                                        :<></>
                                    }
                                </>
                            )
                        })}
                    </tbody>
                    <Separator />

                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.CANCELLED).map(booking => {
                            return (
                                <tr key={`booking-row-${booking.id}`}>
                                    <td className="bold">{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td></td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate.toString()}</td>
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