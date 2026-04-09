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