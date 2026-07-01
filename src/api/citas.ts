import { http } from './http'
import type { Cita, CitaInput, EstatusCita } from './types'

export async function getCitas(): Promise<Cita[]> {
  const { data } = await http.get<Cita[]>('/citas')
  return data
}

export async function getCitasByCliente(usuario: string): Promise<Cita[]> {
  const { data } = await http.get<Cita[]>(`/citas/cliente/${encodeURIComponent(usuario)}`)
  return data
}

export async function getCitasByVeterinario(usuario: string): Promise<Cita[]> {
  const { data } = await http.get<Cita[]>(`/citas/vets/${encodeURIComponent(usuario)}`)
  return data
}

export async function crearCita(
  cita: CitaInput,
  usuarioCliente: string,
  usuarioVet: string,
): Promise<Cita> {
  const { data } = await http.post<Cita>('/citas/', cita, {
    params: { usuarioCliente, usuarioVet },
  })
  return data
}

/** Update appointment status: A = atender, C = cancelar (backend patch). */
export async function actualizarEstatusCita(id: string, estatus: EstatusCita): Promise<Cita> {
  const { data } = await http.put<Cita>(`/citas/${encodeURIComponent(id)}/estatus`, null, {
    params: { estatus },
  })
  return data
}
