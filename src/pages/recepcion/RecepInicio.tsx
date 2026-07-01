import { Link } from 'react-router-dom'
import { getCitas } from '@/api/citas'
import { getClientes } from '@/api/clientes'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { Card, PageHeader } from '@/components/ui'

export function RecepInicio() {
  const { user } = useAuth()
  const clientes = useAsync(() => getClientes(), [])
  const citas = useAsync(() => getCitas(), [])

  return (
    <div>
      <PageHeader title={`Hola, ${user!.nombre}`} subtitle="Panel de recepción" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-brand-400">Clientes</p>
          <p className="mt-1 text-3xl font-semibold text-brand-800">
            {clientes.loading ? '…' : (clientes.data?.length ?? 0)}
          </p>
          <Link to="/recepcion/clientes" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            Ver clientes →
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-brand-400">Citas pendientes</p>
          <p className="mt-1 text-3xl font-semibold text-brand-800">
            {citas.loading ? '…' : (citas.data?.filter((c) => c.estatus === 'P').length ?? 0)}
          </p>
          <Link to="/recepcion/citas" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            Ver citas →
          </Link>
        </Card>
        <Card className="flex flex-col justify-between">
          <p className="text-sm text-brand-400">Agenda por teléfono o mostrador</p>
          <Link to="/recepcion/agendar" className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
            Agendar cita
          </Link>
        </Card>
      </div>
    </div>
  )
}
