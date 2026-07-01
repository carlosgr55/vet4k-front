import { useState } from 'react'
import { crearVeterinario, getVeterinarios } from '@/api/veterinarios'
import { apiErrorMessage } from '@/api/http'
import { useAsync } from '@/lib/useAsync'
import { formatMoney } from '@/lib/format'
import { Modal } from '@/components/Modal'
import { Alert, Button, Card, EmptyState, Field, Input, PageHeader, Spinner } from '@/components/ui'

const EMPTY = { usuario: '', password: '', nombre: '', apellido: '', cedula: '', sueldo: '' }

export function AdminVeterinarios() {
  const { data, loading, error, reload } = useAsync(() => getVeterinarios(), [])
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
      await crearVeterinario({
        usuario: form.usuario.trim(),
        password: form.password,
        nombre: form.nombre,
        apellido: form.apellido,
        cedula: form.cedula,
        sueldo: Number(form.sueldo),
      })
      setOpen(false)
      setForm({ ...EMPTY })
      reload()
    } catch (err) {
      setFormError(apiErrorMessage(err, 'No se pudo registrar el veterinario'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Veterinarios"
        subtitle="Alta y consulta del personal veterinario"
        action={<Button onClick={() => setOpen(true)}>Registrar veterinario</Button>}
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState title="Sin veterinarios" description="Registra el primer veterinario." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-100 text-brand-500">
              <tr>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Cédula</th>
                <th className="px-4 py-3 font-medium text-right">Sueldo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((v) => (
                <tr key={v.usuario} className="border-b border-brand-50 last:border-0">
                  <td className="px-4 py-3 font-mono text-brand-700">{v.usuario}</td>
                  <td className="px-4 py-3 text-brand-800">
                    {v.nombre} {v.apellido}
                  </td>
                  <td className="px-4 py-3 text-brand-600">{v.cedula}</td>
                  <td className="px-4 py-3 text-right text-brand-700">{formatMoney(v.sueldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={open} title="Registrar veterinario" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {formError && <Alert>{formError}</Alert>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" htmlFor="v-nombre">
              <Input id="v-nombre" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} required />
            </Field>
            <Field label="Apellido" htmlFor="v-apellido">
              <Input id="v-apellido" value={form.apellido} onChange={(e) => set('apellido', e.target.value)} required />
            </Field>
          </div>
          <Field label="Usuario" htmlFor="v-usuario">
            <Input id="v-usuario" value={form.usuario} onChange={(e) => set('usuario', e.target.value)} required />
          </Field>
          <Field label="Contraseña" htmlFor="v-password">
            <Input id="v-password" type="text" value={form.password} onChange={(e) => set('password', e.target.value)} required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cédula" htmlFor="v-cedula">
              <Input id="v-cedula" value={form.cedula} onChange={(e) => set('cedula', e.target.value)} required />
            </Field>
            <Field label="Sueldo (MXN)" htmlFor="v-sueldo">
              <Input id="v-sueldo" type="number" min="0" step="0.01" value={form.sueldo} onChange={(e) => set('sueldo', e.target.value)} required />
            </Field>
          </div>
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
