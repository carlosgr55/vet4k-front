import { useState } from 'react'
import { getDiagnosticoByCliente } from '@/api/diagnosticos'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { formatMoney } from '@/lib/format'
import { filterDiagnosticos } from '@/lib/filters'
import { FilterBar } from '@/components/FilterBar'
import { Alert, Card, EmptyState, PageHeader, Spinner } from '@/components/ui'

export function ClienteHistorial() {
  const { user } = useAuth()
  const usuario = user!.usuario
  const { data, loading, error } = useAsync(() => getDiagnosticoByCliente(usuario), [usuario])
  const [query, setQuery] = useState('')

  const all = data ?? []
  const diagnosticos = filterDiagnosticos(all, query)

  return (
    <div>
      <PageHeader title="Historial médico" subtitle="Diagnósticos registrados por los veterinarios" />

      {!loading && !error && all.length > 0 && (
        <FilterBar
          search={query}
          onSearch={setQuery}
          placeholder="Buscar por folio o texto del diagnóstico…"
          count={diagnosticos.length}
        />
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : all.length === 0 ? (
        <EmptyState title="Sin diagnósticos" description="Aquí aparecerán los diagnósticos de tus citas atendidas." />
      ) : diagnosticos.length === 0 ? (
        <EmptyState title="Sin resultados" description="Ningún diagnóstico coincide con la búsqueda." />
      ) : (
        <div className="grid gap-4">
          {diagnosticos.map((d) => (
            <Card key={d.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-brand-400">Diagnóstico #{d.id}</p>
                  <p className="mt-1 text-brand-800">{d.diagnostico}</p>
                </div>
                <span className="whitespace-nowrap font-semibold text-brand-700">{formatMoney(d.precio)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
