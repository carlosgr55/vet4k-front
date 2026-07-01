import { Link } from 'react-router-dom'
import { getCitasByCliente } from '@/api/citas'
import { getMascotasByCliente } from '@/api/mascotas'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { citaTimestamp } from '@/lib/format'
import { CitaCard } from '@/components/CitaCard'
import { Card, EmptyState, PageHeader, Spinner } from '@/components/ui'

export function ClienteInicio() {
  const { user } = useAuth()
  const usuario = user!.usuario
  const mascotas = useAsync(() => getMascotasByCliente(usuario), [usuario])
  const citas = useAsync(() => getCitasByCliente(usuario), [usuario])

  const proximas = (citas.data ?? [])
    .filter((c) => c.estatus === 'P')
    .sort((a, b) => citaTimestamp(a) - citaTimestamp(b))
    .slice(0, 3)

  return (
    <div>
      <PageHeader title={`Hola, ${user!.nombre}`} subtitle="Bienvenido a tu portal de Veterinaria 4K" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-brand-400">Mascotas registradas</p>
          <p className="mt-1 text-3xl font-semibold text-brand-800">
            {mascotas.loading ? '…' : (mascotas.data?.length ?? 0)}
          </p>
          <Link to="/cliente/mascotas" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            Ver mascotas →
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-brand-400">Citas pendientes</p>
          <p className="mt-1 text-3xl font-semibold text-brand-800">
            {citas.loading ? '…' : (citas.data?.filter((c) => c.estatus === 'P').length ?? 0)}
          </p>
          <Link to="/cliente/citas" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            Ver citas →
          </Link>
        </Card>
        <Card className="flex flex-col justify-between">
          <p className="text-sm text-brand-400">¿Necesitas una consulta?</p>
          <Link
            to="/cliente/agendar"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Agendar cita
          </Link>
        </Card>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-semibold text-brand-800">Próximas citas</h2>
      {citas.loading ? (
        <Spinner />
      ) : proximas.length === 0 ? (
        <EmptyState title="No tienes citas pendientes" description="Agenda una cita cuando lo necesites." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proximas.map((c) => (
            <CitaCard key={c.id} cita={c} />
          ))}
        </div>
      )}
    </div>
  )
}
