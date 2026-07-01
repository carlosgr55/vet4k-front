import { actualizarEstatusCita, getCitasByCliente } from '@/api/citas'
import { apiErrorMessage } from '@/api/http'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { citaTimestamp } from '@/lib/format'
import { CitaCard } from '@/components/CitaCard'
import { Alert, Button, EmptyState, PageHeader, Spinner } from '@/components/ui'

export function ClienteCitas() {
  const { user } = useAuth()
  const usuario = user!.usuario
  const { data, loading, error, reload } = useAsync(() => getCitasByCliente(usuario), [usuario])

  async function cancelar(id: string) {
    if (!confirm('¿Cancelar esta cita?')) return
    try {
      await actualizarEstatusCita(id, 'C')
      reload()
    } catch (err) {
      alert(apiErrorMessage(err, 'No se pudo cancelar la cita'))
    }
  }

  const citas = (data ?? []).slice().sort((a, b) => citaTimestamp(b) - citaTimestamp(a))

  return (
    <div>
      <PageHeader title="Mis citas" subtitle="Historial y estado de tus citas" />
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : citas.length === 0 ? (
        <EmptyState title="No tienes citas" description="Agenda una cita desde el menú." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {citas.map((c) => (
            <CitaCard
              key={c.id}
              cita={c}
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
