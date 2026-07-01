import type { Cita, EstatusCita } from '@/api/types'

const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
]

/** Renders a Cita's split date/time fields as "12 mar 2025, 14:30". */
export function formatFechaCita(cita: Pick<Cita, 'dia' | 'mes' | 'ano' | 'hora' | 'minutos'>): string {
  const mes = MESES[(cita.mes ?? 1) - 1] ?? '?'
  const hh = String(cita.hora ?? 0).padStart(2, '0')
  const mm = String(cita.minutos ?? 0).padStart(2, '0')
  return `${cita.dia} ${mes} ${cita.ano}, ${hh}:${mm}`
}

/** Sort key so upcoming/most-recent appointments order consistently. */
export function citaTimestamp(cita: Pick<Cita, 'dia' | 'mes' | 'ano' | 'hora' | 'minutos'>): number {
  return new Date(cita.ano, (cita.mes ?? 1) - 1, cita.dia ?? 1, cita.hora ?? 0, cita.minutos ?? 0).getTime()
}

export const ESTATUS_LABEL: Record<EstatusCita, string> = {
  P: 'Pendiente',
  A: 'Atendida',
  C: 'Cancelada',
}

export const ESTATUS_CLASS: Record<EstatusCita, string> = {
  P: 'bg-amber-100 text-amber-800',
  A: 'bg-brand-100 text-brand-800',
  C: 'bg-rose-100 text-rose-700',
}

export function formatMoney(value: number | undefined | null): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}
