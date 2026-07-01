import { http } from './http'
import type { AuthUser } from './types'

export interface LoginRequest {
  usuario: string
  password: string
}

/**
 * Authenticates against POST /vet4k/login (backend patch). The endpoint checks
 * the clientes, veterinarios and recepcionistas tables plus the configured
 * admin, and returns the resolved role.
 */
export async function login(payload: LoginRequest): Promise<AuthUser> {
  const { data } = await http.post<AuthUser>('/login', payload)
  return data
}
