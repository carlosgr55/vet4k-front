import { Link } from 'react-router-dom'
import { getVeterinarios } from '@/api/veterinarios'
import { getRecepcionistas } from '@/api/recepcion'
import { getClientes } from '@/api/clientes'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { Card, PageHeader } from '@/components/ui'

export function AdminInicio() {
  const { user } = useAuth()
  const vets = useAsync(() => getVeterinarios(), [])
  const receps = useAsync(() => getRecepcionistas(), [])
  const clientes = useAsync(() => getClientes(), [])

  return (
    <div>
      <PageHeader title={`Hola, ${user!.nombre}`} subtitle="Panel de administración" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-brand-400">Veterinarios</p>
          <p className="mt-1 text-3xl font-semibold text-brand-800">
            {vets.loading ? '…' : (vets.data?.length ?? 0)}
          </p>
          <Link to="/admin/veterinarios" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            Administrar →
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-brand-400">Recepcionistas</p>
          <p className="mt-1 text-3xl font-semibold text-brand-800">
            {receps.loading ? '…' : (receps.data?.length ?? 0)}
          </p>
          <Link to="/admin/recepcionistas" className="mt-2 inline-block text-sm text-brand-600 hover:underline">
            Administrar →
          </Link>
        </Card>
        <Card>
          <p className="text-sm text-brand-400">Clientes</p>
          <p className="mt-1 text-3xl font-semibold text-brand-800">
            {clientes.loading ? '…' : (clientes.data?.length ?? 0)}
          </p>
        </Card>
      </div>
    </div>
  )
}
