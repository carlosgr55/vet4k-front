import { Link } from 'react-router-dom'
import { getCitasByVeterinario } from '@/api/citas'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { citaTimestamp } from '@/lib/format'
import { CitaCard } from '@/components/CitaCard'
import { Card, EmptyState, PageHeader, Spinner } from '@/components/ui'

export function VetInicio() {
  const { user } = useAuth()
  const usuario = user!.usuario
  const citas = useAsync(() => getCitasByVeterinario(usuario), [usuario])

  const pendientes = (citas.data ?? [])
    .filter((c) => c.estatus === 'P')
    .sort((a, b) => citaTimestamp(a) - citaTimestamp(b))

  return (
    <div>
      <PageHeader title={`Dr. ${user!.nombre}`} subtitle="Panel del veterinario" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-brand-400">Citas pendientes</p>
          <p className="mt-1 text-3xl font-semibold text-brand-800">
            {citas.loading ? '…' : pendientes.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-brand-400">Atendidas</p>
          <p className="mt-1 text-3xl font-semibold text-brand-800">
            {citas.loading ? '…' : (citas.data?.filter((c) => c.estatus === 'A').length ?? 0)}
          </p>
        </Card>
        <Card className="flex flex-col justify-between">
          <p className="text-sm text-brand-400">Gestiona tus citas</p>
          <Link to="/veterinario/citas" className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            Ver citas
          </Link>
        </Card>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold text-brand-800">Próximas por atender</h2>
      {citas.loading ? (
        <Spinner />
      ) : pendientes.length === 0 ? (
        <EmptyState title="No tienes citas pendientes" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pendientes.slice(0, 6).map((c) => (
            <CitaCard key={c.id} cita={c} perspective="veterinario" />
          ))}
        </div>
      )}
    </div>
  )
}
