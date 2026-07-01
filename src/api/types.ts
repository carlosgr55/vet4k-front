// Domain types mirroring the Spring Boot entities (vet4kback) plus the DTOs
// introduced by the backend patches (login, mascota create, cita status).

export type Role = 'CLIENTE' | 'VETERINARIO' | 'RECEPCION' | 'ADMIN'

export type Sexo = 'M' | 'H'

export const ESPECIES = ['PERRO', 'GATO', 'AVE', 'PEZ', 'ROEDOR'] as const
export type Especie = (typeof ESPECIES)[number]

/** Appointment types, taken from the Java app's scheduling logic. */
export const TIPOS_CITA = ['Revision', 'Vacunacion', 'Estetico', 'Esterelizacion'] as const
export type TipoCita = (typeof TIPOS_CITA)[number]

/** P = Pendiente, A = Atendida, C = Cancelada */
export type EstatusCita = 'P' | 'A' | 'C'

export interface Cliente {
  usuario: string
  password?: string
  nombre: string
  apellido: string
}

export interface Veterinario {
  usuario: string
  password?: string
  nombre: string
  apellido: string
  sueldo: number
  cedula: string
}

export interface Recepcionista {
  usuario: string
  password?: string
  nombre: string
  apellido: string
  sueldo: number
}

export interface Mascota {
  id: number
  nombre: string
  sexo: Sexo
  especie: Especie
}

export interface MascotaInput {
  nombre: string
  sexo: Sexo
  especie: Especie
}

export interface Cita {
  id: string
  cliente: Cliente | null
  veterinario: Veterinario | null
  mascota: string
  dia: number
  mes: number
  ano: number
  hora: number
  minutos: number
  tipo: string
  estatus: EstatusCita
}

/** Payload sent when creating a cita (id/estatus assigned server-side). */
export interface CitaInput {
  mascota: string
  dia: number
  mes: number
  ano: number
  hora: number
  minutos: number
  tipo: string
}

export interface Diagnostico {
  id: string
  diagnostico: string
  precio: number
  cita?: Cita
}

export interface DiagnosticoInput {
  diagnostico: string
  precio: number
}

export interface CorreoCliente {
  id: number
  correo: string
}

export interface TelefonoCliente {
  id: number
  telefono: string
}

export interface CorreoVet {
  id: number
  correo: string
}

export interface TelefonoVet {
  id: number
  telefono: string
}

/** Response from POST /vet4k/login (backend patch). */
export interface AuthUser {
  role: Role
  usuario: string
  nombre: string
  apellido: string
}
