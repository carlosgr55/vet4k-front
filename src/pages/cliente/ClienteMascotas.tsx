import { useState } from 'react'
import { crearMascota, eliminarMascota, getMascotasByCliente } from '@/api/mascotas'
import { apiErrorMessage } from '@/api/http'
import { ESPECIES } from '@/api/types'
import type { Especie, Sexo } from '@/api/types'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { Alert, Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Spinner } from '@/components/ui'

export function ClienteMascotas() {
  const { user } = useAuth()
  const usuario = user!.usuario
  const { data, loading, error, reload } = useAsync(() => getMascotasByCliente(usuario), [usuario])

  const [nombre, setNombre] = useState('')
  const [sexo, setSexo] = useState<Sexo>('M')
  const [especie, setEspecie] = useState<Especie>('PERRO')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      await crearMascota(usuario, { nombre: nombre.trim(), sexo, especie })
      setNombre('')
      reload()
    } catch (err) {
      setFormError(apiErrorMessage(err, 'No se pudo registrar la mascota'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number, nombreMascota: string) {
    if (!confirm(`¿Eliminar a ${nombreMascota}?`)) return
    try {
      await eliminarMascota(id)
      reload()
    } catch (err) {
      alert(apiErrorMessage(err, 'No se pudo eliminar la mascota'))
    }
  }

  return (
    <div>
      <PageHeader title="Mis mascotas" subtitle="Registra y administra a tus compañeros" />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {loading ? (
            <Spinner />
          ) : error ? (
            <Alert>{error}</Alert>
          ) : !data || data.length === 0 ? (
            <EmptyState title="Aún no tienes mascotas" description="Agrega tu primera mascota con el formulario." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.map((m) => (
                <Card key={m.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold text-brand-900">{m.nombre}</p>
                      <div className="mt-1 flex gap-2">
                        <Badge className="bg-brand-100 text-brand-700">{m.especie}</Badge>
                        <Badge className="bg-brand-50 text-brand-600">{m.sexo === 'M' ? 'Macho' : 'Hembra'}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-rose-600" onClick={() => handleDelete(m.id, m.nombre)}>
                      Eliminar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="h-fit">
          <h2 className="mb-4 text-lg font-semibold text-brand-800">Agregar mascota</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            {formError && <Alert>{formError}</Alert>}
            <Field label="Nombre" htmlFor="nombre">
              <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </Field>
            <Field label="Especie" htmlFor="especie">
              <Select id="especie" value={especie} onChange={(e) => setEspecie(e.target.value as Especie)}>
                {ESPECIES.map((esp) => (
                  <option key={esp} value={esp}>
                    {esp}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Sexo" htmlFor="sexo">
              <Select id="sexo" value={sexo} onChange={(e) => setSexo(e.target.value as Sexo)}>
                <option value="M">Macho</option>
                <option value="H">Hembra</option>
              </Select>
            </Field>
            <Button type="submit" loading={saving}>
              Registrar mascota
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
