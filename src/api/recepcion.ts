import { http } from './http'
import type { Recepcionista } from './types'

export interface RecepcionistaInput {
  usuario: string
  password: string
  nombre: string
  apellido: string
  sueldo: number
}

// Recepcionistas endpoints are part of the backend patch (no Spring support yet).

export async function getRecepcionistas(): Promise<Recepcionista[]> {
  const { data } = await http.get<Recepcionista[]>('/recepcion')
  return data
}

export async function crearRecepcionista(recep: RecepcionistaInput): Promise<Recepcionista> {
  const { data } = await http.post<Recepcionista>('/recepcion', recep)
  return data
}
