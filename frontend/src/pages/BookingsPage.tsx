import { useEffect, useMemo, useState } from "react"
import { cancel, checkIn, checkOut, getAllBookings, getAllGuests, getAllRooms, getAllWings } from "../services/api"
import { BookingStatus, type Booking, type Guest, type Room, type Wing } from "../interfaces/interfaces"
import { useToast } from "../context/ToastContext";

const star = "⭐";

export default function BookingsPage() {
    const { addToast } = useToast()
    
    const [allBookings, setAllBookings] = useState<Booking[]>([])
    const [allRooms, setAllRooms] = useState<Room[]>([])
    const [allWings, setAllWings] = useState<Wing[]>([])
    const [allGuests, setAllGuests] = useState<Guest[]>([])

    const [selectedId, setSelectedId] = useState<number | null>(null)

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
                                    <td>{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td></td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate.toString()}</td>
                                    <td><span className="table-badge yellow">{BookingStatus[booking.status]}</span></td>
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
                                    <td>{allGuests.find(g => g.id === booking.guestId)?.name}</td>
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
                                        <td>{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                        <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                        <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                        <td 
                                          style={{cursor: 'pointer'}}
                                          onClick={() => {
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
                                        <td>{!booking.review && <button className="btn btn-primary">Értékelés</button>}</td>
                                    </tr>
                                    {isReviewOpen && booking.review && 
                                        <tr
                                          className="review-display"
                                        >
                                            <td colSpan={5}>{booking.review.comment}</td>
                                            <td colSpan={3}>{booking.review.specialRequests}</td>
                                        </tr>
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
                                    <td>{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td></td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate.toString()}</td>
                                    <td><span className="table-badge red">{BookingStatus[booking.status]}</span></td>
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