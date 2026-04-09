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
  GuestUpdateDto
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

// ─── SIMULATION ───────────────────────────────────────────────────────────────

export const runSimulation          = (): ApiResponse<SimResult> => api.post('/simulation');