import { getDiagnosticoByCliente } from '@/api/diagnosticos'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { formatMoney } from '@/lib/format'
import { Alert, Card, EmptyState, PageHeader, Spinner } from '@/components/ui'

export function ClienteHistorial() {
  const { user } = useAuth()
  const usuario = user!.usuario
  const { data, loading, error } = useAsync(() => getDiagnosticoByCliente(usuario), [usuario])

  return (
    <div>
      <PageHeader title="Historial médico" subtitle="Diagnósticos registrados por los veterinarios" />
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState title="Sin diagnósticos" description="Aquí aparecerán los diagnósticos de tus citas atendidas." />
      ) : (
        <div className="grid gap-4">
          {data.map((d) => (
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
