import type { AxiosResponse } from 'axios';
 
// ─── RESPONSE TÍPUSOK (backend → frontend) ────────────────────────────────────

export type Wing = {
  id: number,
  name: string,
  description: string,
  managerName: string,
  staffCount: number,
  roomCount: number
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