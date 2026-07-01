import type { ReactNode } from 'react'
import type { Cita } from '@/api/types'
import { ESTATUS_CLASS, ESTATUS_LABEL, formatFechaCita } from '@/lib/format'
import { Badge } from './ui'

interface Props {
  cita: Cita
  /** Which side to emphasize in the header. */
  perspective?: 'cliente' | 'veterinario'
  actions?: ReactNode
}

export function CitaCard({ cita, perspective = 'cliente', actions }: Props) {
  const contraparte =
    perspective === 'cliente'
      ? cita.veterinario
        ? `Dr. ${cita.veterinario.nombre} ${cita.veterinario.apellido}`
        : 'Sin veterinario'
      : cita.cliente
        ? `${cita.cliente.nombre} ${cita.cliente.apellido}`
        : 'Sin cliente'

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brand-900">{cita.mascota}</span>
            <Badge className={ESTATUS_CLASS[cita.estatus]}>{ESTATUS_LABEL[cita.estatus]}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-brand-500">{cita.tipo}</p>
        </div>
        <span className="rounded-md bg-brand-50 px-2 py-1 font-mono text-xs text-brand-500">#{cita.id}</span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
        <dt className="text-brand-400">Fecha</dt>
        <dd className="text-right text-brand-800">{formatFechaCita(cita)}</dd>
        <dt className="text-brand-400">{perspective === 'cliente' ? 'Veterinario' : 'Cliente'}</dt>
        <dd className="text-right text-brand-800">{contraparte}</dd>
      </dl>
      {actions && <div className="mt-4 flex justify-end gap-2 border-t border-brand-50 pt-3">{actions}</div>}
    </div>
  )
}
