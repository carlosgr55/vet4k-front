import { useState } from 'react'
import { getClientes } from '@/api/clientes'
import { useAsync } from '@/lib/useAsync'
import { AgendarCitaForm } from '@/components/AgendarCitaForm'
import { Alert, Card, Field, PageHeader, Select, Spinner } from '@/components/ui'

export function RecepAgendar() {
  const { data, loading, error } = useAsync(() => getClientes(), [])
  const [cliente, setCliente] = useState('')

  return (
    <div>
      <PageHeader title="Agendar cita" subtitle="Selecciona el cliente y agenda su cita" />
      <Card className="max-w-2xl">
        {loading ? (
          <Spinner />
        ) : error ? (
          <Alert>{error}</Alert>
        ) : (
          <div className="flex flex-col gap-4">
            <Field label="Cliente" htmlFor="cliente">
              <Select id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)}>
                <option value="">Selecciona un cliente…</option>
                {(data ?? []).map((c) => (
                  <option key={c.usuario} value={c.usuario}>
                    {c.nombre} {c.apellido} ({c.usuario})
                  </option>
                ))}
              </Select>
            </Field>

            {cliente ? (
              <div className="border-t border-brand-50 pt-4">
                <AgendarCitaForm key={cliente} clienteUsuario={cliente} />
              </div>
            ) : (
              <Alert kind="info">Elige un cliente para continuar.</Alert>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
