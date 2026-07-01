import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '@/api/http'
import { crearCliente, existeCliente } from '@/api/clientes'
import { useAuth } from '@/auth/useAuth'
import { ROLE_HOME } from '@/auth/roles'
import { Alert, Button, Card, Field, Input } from '@/components/ui'

export function RegistroPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ nombre: '', apellido: '', usuario: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const usuario = form.usuario.trim()
      if (await existeCliente(usuario)) {
        setError('Ese nombre de usuario ya está registrado.')
        return
      }
      await crearCliente({ ...form, usuario })
      // Auto-login after registration.
      const authUser = await login(usuario, form.password)
      navigate(ROLE_HOME[authUser.role], { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo crear la cuenta'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 to-brand-100 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-brand-900">Crear cuenta</h1>
          <p className="text-sm text-brand-500">Regístrate como cliente</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert>{error}</Alert>}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" htmlFor="nombre">
                <Input id="nombre" value={form.nombre} onChange={(e) => update('nombre', e.target.value)} required />
              </Field>
              <Field label="Apellido" htmlFor="apellido">
                <Input id="apellido" value={form.apellido} onChange={(e) => update('apellido', e.target.value)} required />
              </Field>
            </div>
            <Field label="Usuario" htmlFor="usuario">
              <Input id="usuario" value={form.usuario} onChange={(e) => update('usuario', e.target.value)} required />
            </Field>
            <Field label="Contraseña" htmlFor="password">
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                autoComplete="new-password"
                required
              />
            </Field>
            <Button type="submit" loading={submitting}>
              Crear cuenta
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-brand-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-brand-700 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
