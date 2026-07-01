import { http } from './http'
import type { Cliente } from './types'

export interface ClienteInput {
  usuario: string
  password: string
  nombre: string
  apellido: string
}

export async function getClientes(): Promise<Cliente[]> {
  const { data } = await http.get<Cliente[]>('/clientes')
  return data
}

export async function getCliente(usuario: string): Promise<Cliente> {
  const { data } = await http.get<Cliente>(`/clientes/${encodeURIComponent(usuario)}`)
  return data
}

export async function existeCliente(usuario: string): Promise<boolean> {
  const { data } = await http.get<boolean>(`/clientes/exist/${encodeURIComponent(usuario)}`)
  return data
}

export async function crearCliente(cliente: ClienteInput): Promise<Cliente> {
  const { data } = await http.post<Cliente>('/clientes', cliente)
  return data
}

export async function actualizarCliente(cliente: ClienteInput): Promise<Cliente> {
  const { data } = await http.put<Cliente>('/clientes/', cliente)
  return data
}

export async function eliminarCliente(usuario: string): Promise<void> {
  await http.delete(`/clientes/${encodeURIComponent(usuario)}`)
}
