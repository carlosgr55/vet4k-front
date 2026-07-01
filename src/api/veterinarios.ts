import { http } from './http'
import type { Veterinario } from './types'

export interface VeterinarioInput {
  usuario: string
  password: string
  nombre: string
  apellido: string
  sueldo: number
  cedula: string
}

export async function getVeterinarios(): Promise<Veterinario[]> {
  const { data } = await http.get<Veterinario[]>('/veterinario')
  return data
}

export async function getVeterinario(usuario: string): Promise<Veterinario> {
  const { data } = await http.get<Veterinario>(`/veterinario/${encodeURIComponent(usuario)}`)
  return data
}

export async function crearVeterinario(vet: VeterinarioInput): Promise<Veterinario> {
  const { data } = await http.post<Veterinario>('/veterinario', vet)
  return data
}

/** Vets free at the given date/time (GET /veterinario/?dia&mes&ano&hora&min). */
export async function getVeterinariosDisponibles(params: {
  dia: number
  mes: number
  ano: number
  hora: number
  min: number
}): Promise<Veterinario[]> {
  const { data } = await http.get<Veterinario[]>('/veterinario/', { params })
  return data
}
