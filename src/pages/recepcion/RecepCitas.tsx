import { useState } from 'react'
import { actualizarEstatusCita, getCitas } from '@/api/citas'
import { apiErrorMessage } from '@/api/http'
import { useAsync } from '@/lib/useAsync'
import { citaTimestamp, ESTATUS_LABEL } from '@/lib/format'
import { EMPTY_CITA_FILTERS, filterCitas, uniqueSorted } from '@/lib/filters'
import { CitaCard } from '@/components/CitaCard'
import { FilterBar } from '@/components/FilterBar'
import { Alert, Button, EmptyState, PageHeader, Spinner } from '@/components/ui'

export function RecepCitas() {
  const { data, loading, error, reload } = useAsync(() => getCitas(), [])
  const [filters, setFilters] = useState(EMPTY_CITA_FILTERS)

  async function cancelar(id: string) {
    if (!confirm('¿Cancelar esta cita?')) return
    try {
      await actualizarEstatusCita(id, 'C')
      reload()
    } catch (err) {
      alert(apiErrorMessage(err, 'No se pudo cancelar la cita'))
    }
  }

  const all = data ?? []
  const citas = filterCitas(all, filters, 'veterinario').sort((a, b) => citaTimestamp(b) - citaTimestamp(a))
  const tipos = uniqueSorted(all, (c) => c.tipo)

  return (
    <div>
      <PageHeader title="Citas" subtitle="Todas las citas de la clínica" />

      {!loading && !error && all.length > 0 && (
        <FilterBar
          search={filters.query}
          onSearch={(query) => setFilters((f) => ({ ...f, query }))}
          placeholder="Buscar por mascota, tipo, cliente, veterinario o folio…"
          count={citas.length}
          selects={[
            {
              label: 'Estatus',
              value: filters.estatus,
              onChange: (estatus) => setFilters((f) => ({ ...f, estatus })),
              options: [
                { value: 'P', label: ESTATUS_LABEL.P },
                { value: 'A', label: ESTATUS_LABEL.A },
                { value: 'C', label: ESTATUS_LABEL.C },
              ],
            },
            {
              label: 'Tipo',
              value: filters.tipo,
              onChange: (tipo) => setFilters((f) => ({ ...f, tipo })),
              options: tipos.map((t) => ({ value: t, label: t })),
            },
          ]}
        />
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : all.length === 0 ? (
        <EmptyState title="Sin citas" description="No hay citas registradas." />
      ) : citas.length === 0 ? (
        <EmptyState title="Sin resultados" description="Ninguna cita coincide con los filtros." />
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
