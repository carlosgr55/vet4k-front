import type { Cita, Diagnostico } from '@/api/types'

/** True if `query` (case-insensitive, trimmed) is contained in the value. Empty query matches. */
export function textIncludes(value: string | number | null | undefined, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return value != null && String(value).toLowerCase().includes(q)
}

/** True if the query matches ANY of the provided values. */
export function matchesAny(values: Array<string | number | null | undefined>, query: string): boolean {
  if (!query.trim()) return true
  return values.some((v) => textIncludes(v, query))
}

/** Distinct, sorted, non-empty values extracted from a list — for building select options. */
export function uniqueSorted<T>(items: T[], accessor: (item: T) => string | null | undefined): string[] {
  const set = new Set<string>()
  for (const item of items) {
    const v = accessor(item)
    if (v) set.add(v)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
}

export interface CitaFilters {
  query: string
  estatus: string
  tipo: string
}

export const EMPTY_CITA_FILTERS: CitaFilters = { query: '', estatus: '', tipo: '' }

/**
 * Filters appointments by free text (id, mascota, tipo and the counterpart's
 * name) plus optional status/type. `side` decides whether the counterpart shown
 * is the veterinarian (cliente view) or the client (vet/recepción view).
 */
export function filterCitas(citas: Cita[], f: CitaFilters, side: 'cliente' | 'veterinario'): Cita[] {
  return citas.filter((c) => {
    if (f.estatus && c.estatus !== f.estatus) return false
    if (f.tipo && c.tipo !== f.tipo) return false
    const counterpart = side === 'cliente' ? c.veterinario : c.cliente
    return matchesAny([c.id, c.mascota, c.tipo, counterpart?.nombre, counterpart?.apellido], f.query)
  })
}

/** Filters diagnostics by free text (id and diagnosis text). */
export function filterDiagnosticos(list: Diagnostico[], query: string): Diagnostico[] {
  return list.filter((d) => matchesAny([d.id, d.diagnostico], query))
}
