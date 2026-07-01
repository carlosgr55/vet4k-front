import { http } from './http'
import type { CorreoCliente, CorreoVet, TelefonoCliente, TelefonoVet } from './types'

// ---- Cliente ----

export async function getCorreosCliente(usuario: string): Promise<CorreoCliente[]> {
  const { data } = await http.get<CorreoCliente[]>(
    `/contacto-cliente/correo/${encodeURIComponent(usuario)}`,
  )
  return data
}

export async function getTelefonosCliente(usuario: string): Promise<TelefonoCliente[]> {
  const { data } = await http.get<TelefonoCliente[]>(
    `/contacto-cliente/telefono/${encodeURIComponent(usuario)}`,
  )
  return data
}

export async function agregarCorreoCliente(
  usuario: string,
  correo: string,
): Promise<CorreoCliente> {
  const { data } = await http.post<CorreoCliente>(
    `/contacto-cliente/correo/${encodeURIComponent(usuario)}`,
    { correo },
  )
  return data
}

export async function agregarTelefonoCliente(
  usuario: string,
  telefono: string,
): Promise<TelefonoCliente> {
  const { data } = await http.post<TelefonoCliente>(
    `/contacto-cliente/telefono/${encodeURIComponent(usuario)}`,
    { telefono },
  )
  return data
}

// ---- Veterinario ----

export async function getCorreosVet(usuario: string): Promise<CorreoVet[]> {
  const { data } = await http.get<CorreoVet[]>(
    `/contacto-vet/correo/${encodeURIComponent(usuario)}`,
  )
  return data
}

export async function getTelefonosVet(usuario: string): Promise<TelefonoVet[]> {
  const { data } = await http.get<TelefonoVet[]>(
    `/contacto-vet/telefono/${encodeURIComponent(usuario)}`,
  )
  return data
}

export async function agregarCorreoVet(usuario: string, correo: string): Promise<CorreoVet> {
  const { data } = await http.post<CorreoVet>(
    `/contacto-vet/correo/${encodeURIComponent(usuario)}`,
    { correo },
  )
  return data
}

export async function agregarTelefonoVet(usuario: string, telefono: string): Promise<TelefonoVet> {
  const { data } = await http.post<TelefonoVet>(
    `/contacto-vet/telefono/${encodeURIComponent(usuario)}`,
    { telefono },
  )
  return data
}
