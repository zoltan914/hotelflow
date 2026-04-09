import { useEffect, useMemo, useState } from "react"
import { getAllBookings, getAllGuests, getAllRooms, getAllWings } from "../services/api"
import { BookingStatus, type Booking, type Guest, type Room, type Wing } from "../interfaces/interfaces"


export default function BookingsPage() {

    const [allBookings, setAllBookings] = useState<Booking[]>([])
    const [allRooms, setAllRooms] = useState<Room[]>([])
    const [allWings, setAllWings] = useState<Wing[]>([])
    const [allGuests, setAllGuests] = useState<Guest[]>([])

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

    return (
        <div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Vendég</th>
                            <th>Szoba</th>
                            <th>Szárny</th>
                            <th>Bejelentkezés</th>
                            <th>Kijelentkezés</th>
                            <th>Státusz</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.ACTIVE).map(booking => {
                            return (
                                <tr key={`booking-row-${booking.id}`}>
                                    <td>{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate.toString()}</td>
                                    <td><span className="table-badge gold">{BookingStatus[booking.status]}</span></td>
                                    <td><button className="btn btn-primary">Aktív Művelet</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                    {/* Elválasztó sor */}
                    <tbody>
                        <tr>
                            <td colSpan={7} style={{ padding: '0' }}>
                                <div style={{ borderTop: '3px solid var(--border-dark)', margin: '0' }} />
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.CHECKED_OUT).map(booking => {
                            return (
                                <tr key={`booking-row-${booking.id}`}>
                                    <td>{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate.toString()}</td>
                                    <td><span className="table-badge green">{BookingStatus[booking.status]}</span></td>
                                    <td><button className="btn btn-primary">Kiejentkezett Művelet</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                    {/* Elválasztó sor */}
                    <tbody>
                        <tr>
                            <td colSpan={7} style={{ padding: '0' }}>
                                <div style={{ borderTop: '3px solid var(--border-dark)', margin: '0' }} />
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        {allBookings.filter(b => BookingStatus[b.status] === BookingStatus.CANCELLED).map(booking => {
                            return (
                                <tr key={`booking-row-${booking.id}`}>
                                    <td>{allGuests.find(g => g.id === booking.guestId)?.name}</td>
                                    <td>{allRooms.find(r => r.id === booking.roomId)?.roomNumber}</td>
                                    <td>{allWings.find(w => w.id === booking.wingId)?.name}</td>
                                    <td>{booking.checkInDate.toString()}</td>
                                    <td>{booking.checkOutDate.toString()}</td>
                                    <td><span className="table-badge red">{BookingStatus[booking.status]}</span></td>
                                    <td><button className="btn btn-primary">Cancel Művelet</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
        </div>
    )
}