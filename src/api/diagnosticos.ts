import { http } from './http'
import type { Diagnostico, DiagnosticoInput } from './types'

export async function getDiagnosticos(): Promise<Diagnostico[]> {
  const { data } = await http.get<Diagnostico[]>('/diagnostico')
  return data
}

export async function getDiagnosticoByCliente(usuario: string): Promise<Diagnostico[]> {
  const { data } = await http.get<Diagnostico[]>(`/diagnostico/cliente/${encodeURIComponent(usuario)}`)
  return data
}

export async function getDiagnosticoByVeterinario(usuario: string): Promise<Diagnostico[]> {
  const { data } = await http.get<Diagnostico[]>(`/diagnostico/vet/${encodeURIComponent(usuario)}`)
  return data
}

export async function getDiagnosticoByCita(citaId: string): Promise<Diagnostico | null> {
  const { data } = await http.get<Diagnostico | null>(`/diagnostico/cita/${encodeURIComponent(citaId)}`)
  return data
}

export async function crearDiagnostico(
  citaId: string,
  diagnostico: DiagnosticoInput,
): Promise<Diagnostico> {
  const { data } = await http.post<Diagnostico>(
    `/diagnostico/${encodeURIComponent(citaId)}`,
    diagnostico,
  )
  return data
}
