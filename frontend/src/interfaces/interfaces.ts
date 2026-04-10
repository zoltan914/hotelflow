import type { AxiosResponse } from 'axios';
 
// ─── ENUMOK ───────────────────────────────────────────────────────────────────

export enum StaffRole {
  RECEPTIONIST="Recepciós", HOUSEKEEPER="Takarító", CONCIERGE="Házfelügyelő", MANAGER="Manager"
}

export enum GuestTier {
  STANDARD="Standard", SILVER="Silver", GOLD="Arany", PLATINUM="Platina"
}

export enum RoomType {
  STANDARD="Standard", DELUXE="Deluxe", SUITE="Suite", PENTHOUSE="Penthouse"
}

export enum BookingStatus {
  PENDING="Függőben", ACTIVE="Aktív", CHECKED_OUT="Kijelentkezett", CANCELLED="Törölve"
}

export enum ServiceType {
  ROOM_SERVICE="Szobaszervíz", HOUSEKEEPING="Takarítás", MAINTENANCE="Karbantartás", CONCIERGE="Portaszolgálat", SPA="Wellness"
}

// ─── RESPONSE TÍPUSOK (backend → frontend) ────────────────────────────────────

export type Wing = {
  id: number
  name: string
  description: string
  managerName: string
  staffCount: number
  roomCount: number
}

export type Staff = {
  id: number
  name: string
  role: keyof typeof StaffRole
  email: string
  wingId: number
}

export type ActiveBooking = {
  id: number
  roomNumber: string
  checkInDate: Date
  checkOutDate: Date
}

export type Guest = {
  id: number
  name: string
  passportNumber: string
  email: string
  tier: keyof typeof GuestTier
  activeBooking: ActiveBooking
  bookingCount: number
}

export type Room = {
  id: number
  roomNumber: string
  wingId: number
  roomType: keyof typeof RoomType
  pricePerNight: number
  capacity: number
  bookedNightsCount: number
}


export type Review = {
  id: number
  bookingId: number
  stars: number
  comment: string
  specialRequests: string
}


export type Booking = {
  id: number
  guestId: number,
  roomId: number,
  wingId: number,
  checkInDate: Date,
  checkOutDate: Date,
  status: keyof typeof BookingStatus 
  review: Review
}

export type ServiceRequest = {
  id: number,
  guestId: number,
  staffId: number,
  requestDate: Date,
  type: keyof typeof ServiceType,
  description: string
}


export type SimResult = {
  status: string,
  message: string[]
} 

// ─── REQUEST DTO-K (frontend → backend) ───────────────────────────────────────

export type WingCreateDto = {
  name: string
  description: string
  managerName: string
}
 
export type WingUpdateDto = WingCreateDto

export type StaffCreateDto = {
  name: string
  role: StaffRole
  email: string
  wingId: number
}

export type StaffUpdateDto = StaffCreateDto

export type GuestCreateDto = {
  name: string
  passportNumber: string
  email: string
  tier: GuestTier
}

export type GuestUpdateDto = GuestCreateDto

export type RoomCreateDto = {
  roomNumber: string
  wingId: number
  roomType: RoomType
  pricePerNight: number
  capacity: number
}

export type RoomUpdateDto = RoomCreateDto

export type BookingCreateDto = {
  guestId: number | null
  roomId: number | null
  checkInDate: Date | null
  checkOutDate: Date | null
}

export type ReviewCreateDto = {
  stars: number
  comment: string
  specialRequests: string
}

export type ReviewUpdateDto = ReviewCreateDto

export type ServiceRequestCreateDto = {
  guestId: number | null
  staffId: number | null
  requestDate: Date | null
  type: ServiceType | null
  description: string
}


// ─── TOAST ────────────────────────────────────────────────────────────────────
 
export type ToastType = 'success' | 'error' | 'info' | 'warning'
 
export type Toast = {
  id: number
  message: string
  type: ToastType
}
 
// ─── API RESPONSE SEGÉDTÍPUS ──────────────────────────────────────────────────
// Használat: ApiResponse<Patient> helyett AxiosResponse<Patient>
// hogy az oldalakban ne kelljen az axiost importálni
 
export type ApiResponse<T> = Promise<AxiosResponse<T>>