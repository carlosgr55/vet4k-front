import { useState } from 'react'
import { getDiagnosticoByVeterinario } from '@/api/diagnosticos'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { formatMoney } from '@/lib/format'
import { filterDiagnosticos } from '@/lib/filters'
import { FilterBar } from '@/components/FilterBar'
import { Alert, Card, EmptyState, PageHeader, Spinner } from '@/components/ui'

export function VetHistorial() {
  const { user } = useAuth()
  const usuario = user!.usuario
  const { data, loading, error } = useAsync(() => getDiagnosticoByVeterinario(usuario), [usuario])
  const [query, setQuery] = useState('')

  const all = data ?? []
  const diagnosticos = filterDiagnosticos(all, query)
  // Total reflects the current filter so it stays consistent with what's shown.
  const total = diagnosticos.reduce((sum, d) => sum + (d.precio ?? 0), 0)

  return (
    <div>
      <PageHeader
        title="Diagnósticos"
        subtitle="Diagnósticos que has registrado"
        action={
          all.length > 0 ? (
            <div className="text-right">
              <p className="text-xs text-brand-400">Total facturado</p>
              <p className="text-lg font-semibold text-brand-700">{formatMoney(total)}</p>
            </div>
          ) : null
        }
      />

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
        <EmptyState title="Sin diagnósticos" description="Los diagnósticos que registres aparecerán aquí." />
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
