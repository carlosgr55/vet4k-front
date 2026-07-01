import { useState } from 'react'
import { actualizarEstatusCita, getCitasByVeterinario } from '@/api/citas'
import { crearDiagnostico } from '@/api/diagnosticos'
import { apiErrorMessage } from '@/api/http'
import type { Cita } from '@/api/types'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { citaTimestamp } from '@/lib/format'
import { CitaCard } from '@/components/CitaCard'
import { Modal } from '@/components/Modal'
import { Alert, Button, EmptyState, Field, Input, PageHeader, Spinner, Textarea } from '@/components/ui'

export function VetCitas() {
  const { user } = useAuth()
  const usuario = user!.usuario
  const { data, loading, error, reload } = useAsync(() => getCitasByVeterinario(usuario), [usuario])

  const [atender, setAtender] = useState<Cita | null>(null)
  const [diagnostico, setDiagnostico] = useState('')
  const [precio, setPrecio] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  function openAtender(cita: Cita) {
    setAtender(cita)
    setDiagnostico('')
    setPrecio('')
    setFormError(null)
  }

  async function submitDiagnostico(e: React.FormEvent) {
    e.preventDefault()
    if (!atender) return
    setFormError(null)
    setSaving(true)
    try {
      await crearDiagnostico(atender.id, { diagnostico: diagnostico.trim(), precio: Number(precio) })
      await actualizarEstatusCita(atender.id, 'A')
      setAtender(null)
      reload()
    } catch (err) {
      setFormError(apiErrorMessage(err, 'No se pudo registrar el diagnóstico'))
    } finally {
      setSaving(false)
    }
  }

  const citas = (data ?? []).slice().sort((a, b) => citaTimestamp(b) - citaTimestamp(a))

  return (
    <div>
      <PageHeader title="Citas" subtitle="Atiende y registra diagnósticos" />
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : citas.length === 0 ? (
        <EmptyState title="No tienes citas asignadas" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {citas.map((c) => (
            <CitaCard
              key={c.id}
              cita={c}
              perspective="veterinario"
              actions={
                c.estatus === 'P' ? (
                  <Button onClick={() => openAtender(c)}>Atender</Button>
                ) : null
              }
            />
          ))}
        </div>
      )}

      <Modal open={!!atender} title={`Atender: ${atender?.mascota ?? ''}`} onClose={() => setAtender(null)}>
        <form onSubmit={submitDiagnostico} className="flex flex-col gap-4">
          {formError && <Alert>{formError}</Alert>}
          <Field label="Diagnóstico" htmlFor="diag">
            <Textarea
              id="diag"
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              placeholder="Describe el diagnóstico y tratamiento…"
              required
            />
          </Field>
          <Field label="Precio (MXN)" htmlFor="precio">
            <Input
              id="precio"
              type="number"
              min="0"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setAtender(null)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Guardar y marcar atendida
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
