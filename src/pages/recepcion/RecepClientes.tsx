import { useState } from 'react'
import { crearCliente, eliminarCliente, existeCliente, getClientes } from '@/api/clientes'
import { apiErrorMessage } from '@/api/http'
import { useAsync } from '@/lib/useAsync'
import { matchesAny } from '@/lib/filters'
import { FilterBar } from '@/components/FilterBar'
import { Modal } from '@/components/Modal'
import { Alert, Button, Card, EmptyState, Field, Input, PageHeader, Spinner } from '@/components/ui'

export function RecepClientes() {
  const { data, loading, error, reload } = useAsync(() => getClientes(), [])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', apellido: '', usuario: '', password: '' })
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const all = data ?? []
  const filtered = all.filter((c) => matchesAny([c.usuario, c.nombre, c.apellido], query))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      const usuario = form.usuario.trim()
      if (await existeCliente(usuario)) {
        setFormError('Ese usuario ya está registrado.')
        return
      }
      await crearCliente({ ...form, usuario })
      setOpen(false)
      setForm({ nombre: '', apellido: '', usuario: '', password: '' })
      reload()
    } catch (err) {
      setFormError(apiErrorMessage(err, 'No se pudo registrar el cliente'))
    } finally {
      setSaving(false)
    }
  }

  async function borrar(usuario: string) {
    if (!confirm(`¿Eliminar al cliente ${usuario}?`)) return
    try {
      await eliminarCliente(usuario)
      reload()
    } catch (err) {
      alert(apiErrorMessage(err, 'No se pudo eliminar el cliente'))
    }
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Registro y administración de clientes"
        action={<Button onClick={() => setOpen(true)}>Registrar cliente</Button>}
      />

      {!loading && !error && all.length > 0 && (
        <FilterBar
          search={query}
          onSearch={setQuery}
          placeholder="Buscar por usuario, nombre o apellido…"
          count={filtered.length}
        />
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : all.length === 0 ? (
        <EmptyState title="Sin clientes" description="Registra el primer cliente." />
      ) : filtered.length === 0 ? (
        <EmptyState title="Sin resultados" description="Ningún cliente coincide con la búsqueda." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-100 text-brand-500">
              <tr>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.usuario} className="border-b border-brand-50 last:border-0">
                  <td className="px-4 py-3 font-mono text-brand-700">{c.usuario}</td>
                  <td className="px-4 py-3 text-brand-800">
                    {c.nombre} {c.apellido}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" className="text-rose-600" onClick={() => borrar(c.usuario)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={open} title="Registrar cliente" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {formError && <Alert>{formError}</Alert>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" htmlFor="r-nombre">
              <Input id="r-nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </Field>
            <Field label="Apellido" htmlFor="r-apellido">
              <Input id="r-apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} required />
            </Field>
          </div>
          <Field label="Usuario" htmlFor="r-usuario">
            <Input id="r-usuario" value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} required />
          </Field>
          <Field label="Contraseña" htmlFor="r-password">
            <Input id="r-password" type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Registrar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
