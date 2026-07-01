import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { apiErrorMessage } from '@/api/http'
import { useAuth } from '@/auth/useAuth'
import { ROLE_HOME } from '@/auth/roles'
import { Alert, Button, Card, Field, Input } from '@/components/ui'

export function LoginPage() {
  const { user, login, loading } = useAuth()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) return <Navigate to={ROLE_HOME[user.role]} replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const authUser = await login(usuario.trim(), password)
      navigate(ROLE_HOME[authUser.role], { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Usuario o contraseña incorrectos'))
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 to-brand-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-2xl font-bold text-white">
            4k
          </div>
          <h1 className="text-2xl font-semibold text-brand-900">Veterinaria 4K</h1>
          <p className="text-sm text-brand-500">Inicia sesión para continuar</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert>{error}</Alert>}
            <Field label="Usuario" htmlFor="usuario">
              <Input
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                required
              />
            </Field>
            <Field label="Contraseña" htmlFor="password">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
            <Button type="submit" loading={loading}>
              Entrar
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-brand-500">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-medium text-brand-700 hover:underline">
              Crea una
            </Link>
          </p>
        </Card>
        <p className="mt-4 text-center text-xs text-brand-400">
          Personal (veterinario / recepción / admin) usa el mismo formulario.
        </p>
      </div>
    </div>
  )
}
