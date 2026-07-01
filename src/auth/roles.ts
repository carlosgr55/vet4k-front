import type { Role } from '@/api/types'

/** Landing route for each role after login. */
export const ROLE_HOME: Record<Role, string> = {
  CLIENTE: '/cliente',
  VETERINARIO: '/veterinario',
  RECEPCION: '/recepcion',
  ADMIN: '/admin',
}

export const ROLE_LABEL: Record<Role, string> = {
  CLIENTE: 'Cliente',
  VETERINARIO: 'Veterinario',
  RECEPCION: 'Recepción',
  ADMIN: 'Administrador',
}
