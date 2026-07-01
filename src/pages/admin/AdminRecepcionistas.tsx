import { useState } from 'react'
import { crearRecepcionista, getRecepcionistas } from '@/api/recepcion'
import { apiErrorMessage } from '@/api/http'
import { useAsync } from '@/lib/useAsync'
import { formatMoney } from '@/lib/format'
import { Modal } from '@/components/Modal'
import { Alert, Button, Card, EmptyState, Field, Input, PageHeader, Spinner } from '@/components/ui'

const EMPTY = { usuario: '', password: '', nombre: '', apellido: '', sueldo: '' }

export function AdminRecepcionistas() {
  const { data, loading, error, reload } = useAsync(() => getRecepcionistas(), [])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      await crearRecepcionista({
        usuario: form.usuario.trim(),
        password: form.password,
        nombre: form.nombre,
        apellido: form.apellido,
        sueldo: Number(form.sueldo),
      })
      setOpen(false)
      setForm({ ...EMPTY })
      reload()
    } catch (err) {
      setFormError(apiErrorMessage(err, 'No se pudo registrar el recepcionista'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Recepcionistas"
        subtitle="Alta y consulta del personal de recepción"
        action={<Button onClick={() => setOpen(true)}>Registrar recepcionista</Button>}
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState title="Sin recepcionistas" description="Registra el primer recepcionista." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-100 text-brand-500">
              <tr>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium text-right">Sueldo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r) => (
                <tr key={r.usuario} className="border-b border-brand-50 last:border-0">
                  <td className="px-4 py-3 font-mono text-brand-700">{r.usuario}</td>
                  <td className="px-4 py-3 text-brand-800">
                    {r.nombre} {r.apellido}
                  </td>
                  <td className="px-4 py-3 text-right text-brand-700">{formatMoney(r.sueldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={open} title="Registrar recepcionista" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {formError && <Alert>{formError}</Alert>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" htmlFor="re-nombre">
              <Input id="re-nombre" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} required />
            </Field>
            <Field label="Apellido" htmlFor="re-apellido">
              <Input id="re-apellido" value={form.apellido} onChange={(e) => set('apellido', e.target.value)} required />
            </Field>
          </div>
          <Field label="Usuario" htmlFor="re-usuario">
            <Input id="re-usuario" value={form.usuario} onChange={(e) => set('usuario', e.target.value)} required />
          </Field>
          <Field label="Contraseña" htmlFor="re-password">
            <Input id="re-password" type="text" value={form.password} onChange={(e) => set('password', e.target.value)} required />
          </Field>
          <Field label="Sueldo (MXN)" htmlFor="re-sueldo">
            <Input id="re-sueldo" type="number" min="0" step="0.01" value={form.sueldo} onChange={(e) => set('sueldo', e.target.value)} required />
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
