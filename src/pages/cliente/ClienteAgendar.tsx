import { useAuth } from '@/auth/useAuth'
import { AgendarCitaForm } from '@/components/AgendarCitaForm'
import { Card, PageHeader } from '@/components/ui'

export function ClienteAgendar() {
  const { user } = useAuth()
  return (
    <div>
      <PageHeader title="Agendar cita" subtitle="Elige mascota, fecha y veterinario disponible" />
      <Card className="max-w-2xl">
        <AgendarCitaForm clienteUsuario={user!.usuario} />
      </Card>
    </div>
  )
}
