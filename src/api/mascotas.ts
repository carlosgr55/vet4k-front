import { http } from './http'
import type { Mascota, MascotaInput } from './types'

export async function getMascotas(): Promise<Mascota[]> {
  const { data } = await http.get<Mascota[]>('/mascotas')
  return data
}

export async function getMascota(id: number): Promise<Mascota> {
  const { data } = await http.get<Mascota>(`/mascotas/${id}`)
  return data
}

export async function getMascotasByCliente(usuario: string): Promise<Mascota[]> {
  const { data } = await http.get<Mascota[]>(`/mascotas/cliente/${encodeURIComponent(usuario)}`)
  return data
}

/** Create a pet for a client (POST /mascotas/{usuario} — backend patch). */
export async function crearMascota(usuario: string, mascota: MascotaInput): Promise<Mascota> {
  const { data } = await http.post<Mascota>(`/mascotas/${encodeURIComponent(usuario)}`, mascota)
  return data
}

export async function eliminarMascota(id: number): Promise<void> {
  await http.delete(`/mascotas/${id}`)
}
