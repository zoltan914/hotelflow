import axios from 'axios';
import type {
  SimResult,
  ApiResponse,
  Wing,
  WingCreateDto,
  WingUpdateDto,
  Staff,
  StaffCreateDto,
  StaffUpdateDto,
  Guest,
  GuestCreateDto,
  GuestUpdateDto,
  Room,
  RoomCreateDto,
  RoomUpdateDto,
  Booking,
  BookingCreateDto,
  Review,
  ReviewCreateDto,
  ReviewUpdateDto
} from '../interfaces/interfaces';

// ─── AXIOS INSTANCE ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: '/api',
});

// ─── INTERCEPTOR ──────────────────────────────────────────────────────────────

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn('Nincs jogosultság (401)');
    } else if (status >= 500) {
      console.error('Szerverhiba:', status);
    }
    return Promise.reject(error);
  }
);


// ─── WINGS ──────────────────────────────────────────────────────────────

export const getAllWings    = (): ApiResponse<Wing[]>  => api.get('/wings');
export const createWing     = (data: WingCreateDto): ApiResponse<Wing> => api.post('/wings', data);
export const updateWing     = (id: number, data: WingUpdateDto): ApiResponse<Wing> => api.put(`/wings/${id}`, data);
export const deleteWing     = (id: number): ApiResponse<void> => api.delete(`/wings/${id}`);

// ─── STAFF ──────────────────────────────────────────────────────────────

export const getAllStaff    = (): ApiResponse<Staff[]> => api.get('/staff')
export const createStaff    = (data: StaffCreateDto): ApiResponse<Staff> => api.post('/staff', data)
export const updateStaff    = (id: number, data: StaffUpdateDto): ApiResponse<Staff> => api.put(`/staff/${id}`, data)
export const deleteStaff    = (id: number): ApiResponse<void> => api.delete(`/staff/${id}`)

// ─── GUEST ──────────────────────────────────────────────────────────────

export const getAllGuests   = (): ApiResponse<Guest[]> => api.get('/guests')
export const createGuest    = (data: GuestCreateDto): ApiResponse<Guest> => api.post('/guests', data)
export const udpateGuest    = (id: number, data: GuestUpdateDto): ApiResponse<Guest> => api.put(`/guests/${id}`, data)
export const deleteGuest    = (id: number): ApiResponse<void> => api.delete(`/guests/${id}`)

// ─── ROOM ──────────────────────────────────────────────────────────────

export const getAllRooms   = (): ApiResponse<Room[]> => api.get('/rooms')
export const createRoom    = (data: RoomCreateDto): ApiResponse<Room> => api.post('/rooms', data)
export const udpateRoom    = (id: number, data: RoomUpdateDto): ApiResponse<Room> => api.put(`/rooms/${id}`, data)
export const deleteRoom    = (id: number): ApiResponse<void> => api.delete(`/rooms/${id}`)

// ─── BOOKING ──────────────────────────────────────────────────────────────

export const getAllBookings= (): ApiResponse<Booking[]> => api.get('/bookings')
export const creteBooking  = (data: BookingCreateDto): ApiResponse<Booking> => api.post('/bookings', data) 
export const checkIn       = (id: number): ApiResponse<Booking> => api.put(`/bookings/${id}/checkin`)
export const checkOut      = (id: number): ApiResponse<Booking> => api.put(`/bookings/${id}/checkout`)
export const cancel        = (id: number): ApiResponse<Booking> => api.put(`/bookings/${id}/cancel`)

// ─── REVIEW ──────────────────────────────────────────────────────────────

export const createReview  = (id: number, data: ReviewCreateDto): ApiResponse<Review> => api.post(`/bookings/${id}/review`, data)
export const updateReview  = (id: number, data: ReviewUpdateDto): ApiResponse<Review> => api.put(`/bookings/${id}/review`, data)

// ─── SIMULATION ───────────────────────────────────────────────────────────────

export const runSimulation          = (): ApiResponse<SimResult> => api.post('/simulation');