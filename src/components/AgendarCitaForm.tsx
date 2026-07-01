import { useMemo, useState } from 'react'
import { crearCita } from '@/api/citas'
import { getMascotasByCliente } from '@/api/mascotas'
import { getVeterinariosDisponibles } from '@/api/veterinarios'
import { apiErrorMessage } from '@/api/http'
import type { Veterinario } from '@/api/types'
import { TIPOS_CITA } from '@/api/types'
import { useAsync } from '@/lib/useAsync'
import { Alert, Button, Field, Input, Select, Spinner } from '@/components/ui'

/** Whole-hour slots, matching the Java app's 09:00–18:00 availability. */
const HORAS = Array.from({ length: 10 }, (_, i) => 9 + i)
const MINUTOS = [0, 30]

interface Props {
  clienteUsuario: string
  onDone?: () => void
}

export function AgendarCitaForm({ clienteUsuario, onDone }: Props) {
  const mascotas = useAsync(() => getMascotasByCliente(clienteUsuario), [clienteUsuario])

  const today = new Date()
  const [mascota, setMascota] = useState('')
  const [tipo, setTipo] = useState<string>(TIPOS_CITA[0])
  const [fecha, setFecha] = useState(today.toISOString().slice(0, 10))
  const [hora, setHora] = useState(9)
  const [minutos, setMinutos] = useState(0)

  const [vets, setVets] = useState<Veterinario[] | null>(null)
  const [vetSel, setVetSel] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const { dia, mes, ano } = useMemo(() => {
    const [y, m, d] = fecha.split('-').map(Number)
    return { dia: d, mes: m, ano: y }
  }, [fecha])

  async function buscarVets() {
    setError(null)
    setOk(null)
    setVets(null)
    setVetSel('')
    setBuscando(true)
    try {
      const disponibles = await getVeterinariosDisponibles({ dia, mes, ano, hora, min: minutos })
      setVets(disponibles)
      if (disponibles.length > 0) setVetSel(disponibles[0].usuario)
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudieron consultar los veterinarios disponibles'))
    } finally {
      setBuscando(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setOk(null)
    if (!mascota) return setError('Selecciona una mascota.')
    if (!vetSel) return setError('Selecciona un veterinario disponible.')
    setSubmitting(true)
    try {
      await crearCita({ mascota, tipo, dia, mes, ano, hora, minutos }, clienteUsuario, vetSel)
      setOk('Cita agendada correctamente.')
      setVets(null)
      setVetSel('')
      onDone?.()
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo agendar la cita'))
    } finally {
      setSubmitting(false)
    }
  }

  if (mascotas.loading) return <Spinner label="Cargando mascotas…" />
  if (mascotas.error) return <Alert>{mascotas.error}</Alert>
  if (!mascotas.data || mascotas.data.length === 0) {
    return (
      <Alert kind="info">
        Este cliente no tiene mascotas registradas. Registra una mascota antes de agendar una cita.
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert>{error}</Alert>}
      {ok && <Alert kind="success">{ok}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mascota" htmlFor="mascota">
          <Select id="mascota" value={mascota} onChange={(e) => setMascota(e.target.value)} required>
            <option value="">Selecciona…</option>
            {mascotas.data.map((m) => (
              <option key={m.id} value={m.nombre}>
                {m.nombre} · {m.especie}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tipo de cita" htmlFor="tipo">
          <Select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS_CITA.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Fecha" htmlFor="fecha">
          <Input
            id="fecha"
            type="date"
            value={fecha}
            min={today.toISOString().slice(0, 10)}
            onChange={(e) => {
              setFecha(e.target.value)
              setVets(null)
            }}
            required
          />
        </Field>
        <Field label="Hora" htmlFor="hora">
          <Select
            id="hora"
            value={hora}
            onChange={(e) => {
              setHora(Number(e.target.value))
              setVets(null)
            }}
          >
            {HORAS.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}:00
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Minutos" htmlFor="minutos">
          <Select
            id="minutos"
            value={minutos}
            onChange={(e) => {
              setMinutos(Number(e.target.value))
              setVets(null)
            }}
          >
            {MINUTOS.map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, '0')}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div>
        <Button type="button" variant="secondary" onClick={buscarVets} loading={buscando}>
          Buscar veterinarios disponibles
        </Button>
      </div>

      {vets && (
        <Field label="Veterinario disponible" htmlFor="vet">
          {vets.length === 0 ? (
            <Alert kind="info">No hay veterinarios disponibles en ese horario. Prueba otra hora.</Alert>
          ) : (
            <Select id="vet" value={vetSel} onChange={(e) => setVetSel(e.target.value)}>
              {vets.map((v) => (
                <option key={v.usuario} value={v.usuario}>
                  {v.nombre} {v.apellido} (céd. {v.cedula})
                </option>
              ))}
            </Select>
          )}
        </Field>
      )}

      <div>
        <Button type="submit" loading={submitting} disabled={!vetSel}>
          Agendar cita
        </Button>
      </div>
    </form>
  )
}
