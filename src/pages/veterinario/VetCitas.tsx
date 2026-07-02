import { useState } from 'react'
import { actualizarEstatusCita, getCitasByVeterinario } from '@/api/citas'
import { crearDiagnostico } from '@/api/diagnosticos'
import { apiErrorMessage } from '@/api/http'
import type { Cita } from '@/api/types'
import { useAuth } from '@/auth/useAuth'
import { useAsync } from '@/lib/useAsync'
import { citaTimestamp, ESTATUS_LABEL } from '@/lib/format'
import { EMPTY_CITA_FILTERS, filterCitas, uniqueSorted } from '@/lib/filters'
import { CitaCard } from '@/components/CitaCard'
import { FilterBar } from '@/components/FilterBar'
import { Modal } from '@/components/Modal'
import { Alert, Button, EmptyState, Field, Input, PageHeader, Spinner, Textarea } from '@/components/ui'

export function VetCitas() {
  const { user } = useAuth()
  const usuario = user!.usuario
  const { data, loading, error, reload } = useAsync(() => getCitasByVeterinario(usuario), [usuario])

  const [filters, setFilters] = useState(EMPTY_CITA_FILTERS)
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

  const all = data ?? []
  const citas = filterCitas(all, filters, 'veterinario').sort((a, b) => citaTimestamp(b) - citaTimestamp(a))
  const tipos = uniqueSorted(all, (c) => c.tipo)

  return (
    <div>
      <PageHeader title="Citas" subtitle="Atiende y registra diagnósticos" />

      {!loading && !error && all.length > 0 && (
        <FilterBar
          search={filters.query}
          onSearch={(query) => setFilters((f) => ({ ...f, query }))}
          placeholder="Buscar por mascota, tipo, cliente o folio…"
          count={citas.length}
          selects={[
            {
              label: 'Estatus',
              value: filters.estatus,
              onChange: (estatus) => setFilters((f) => ({ ...f, estatus })),
              options: [
                { value: 'P', label: ESTATUS_LABEL.P },
                { value: 'A', label: ESTATUS_LABEL.A },
                { value: 'C', label: ESTATUS_LABEL.C },
              ],
            },
            {
              label: 'Tipo',
              value: filters.tipo,
              onChange: (tipo) => setFilters((f) => ({ ...f, tipo })),
              options: tipos.map((t) => ({ value: t, label: t })),
            },
          ]}
        />
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : all.length === 0 ? (
        <EmptyState title="No tienes citas asignadas" />
      ) : citas.length === 0 ? (
        <EmptyState title="Sin resultados" description="Ninguna cita coincide con los filtros." />
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
