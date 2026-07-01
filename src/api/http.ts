import axios from 'axios'

/**
 * Base URL of the Spring Boot backend, parametrized via VITE_API_BASE_URL so it
 * can be repointed (local / staging / prod) without code changes. All backend
 * routes live under the `/vet4k` context, appended here.
 */
const baseURL = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/vet4k`

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

/** Normalizes backend/network errors into a readable message for the UI. */
export function apiErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as { message?: string } | string | undefined
      if (typeof data === 'string' && data.trim()) return data
      if (data && typeof data === 'object' && data.message) return data.message
      return `Error ${error.response.status}: ${error.response.statusText}`
    }
    if (error.request) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.'
    }
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
