import { useState } from 'react'
import { actualizarEstatusCita, getCitas } from '@/api/citas'
import { apiErrorMessage } from '@/api/http'
import type { EstatusCita } from '@/api/types'
import { useAsync } from '@/lib/useAsync'
import { citaTimestamp } from '@/lib/format'
import { CitaCard } from '@/components/CitaCard'
import { Alert, Button, EmptyState, PageHeader, Spinner } from '@/components/ui'

const FILTROS: { value: EstatusCita | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'P', label: 'Pendientes' },
  { value: 'A', label: 'Atendidas' },
  { value: 'C', label: 'Canceladas' },
]

export function RecepCitas() {
  const { data, loading, error, reload } = useAsync(() => getCitas(), [])
  const [filtro, setFiltro] = useState<EstatusCita | 'ALL'>('ALL')

  async function cancelar(id: string) {
    if (!confirm('¿Cancelar esta cita?')) return
    try {
      await actualizarEstatusCita(id, 'C')
      reload()
    } catch (err) {
      alert(apiErrorMessage(err, 'No se pudo cancelar la cita'))
    }
  }

  const citas = (data ?? [])
    .filter((c) => filtro === 'ALL' || c.estatus === filtro)
    .sort((a, b) => citaTimestamp(b) - citaTimestamp(a))

  return (
    <div>
      <PageHeader title="Citas" subtitle="Todas las citas de la clínica" />

      <div className="mb-4 flex gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filtro === f.value ? 'bg-brand-600 text-white' : 'bg-white text-brand-600 hover:bg-brand-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : citas.length === 0 ? (
        <EmptyState title="Sin citas" description="No hay citas con este filtro." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {citas.map((c) => (
            <CitaCard
              key={c.id}
              cita={c}
              perspective="veterinario"
              actions={
                c.estatus === 'P' ? (
                  <Button variant="danger" onClick={() => cancelar(c.id)}>
                    Cancelar
                  </Button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
