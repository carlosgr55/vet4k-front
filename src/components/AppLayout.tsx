import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import type { Role } from '@/api/types'
import { useAuth } from '@/auth/useAuth'
import { ROLE_LABEL } from '@/auth/roles'
import { Button } from './ui'

interface NavItem {
  to: string
  label: string
}

const NAV: Record<Role, NavItem[]> = {
  CLIENTE: [
    { to: '/cliente', label: 'Inicio' },
    { to: '/cliente/mascotas', label: 'Mis mascotas' },
    { to: '/cliente/agendar', label: 'Agendar cita' },
    { to: '/cliente/citas', label: 'Mis citas' },
    { to: '/cliente/historial', label: 'Historial' },
  ],
  VETERINARIO: [
    { to: '/veterinario', label: 'Inicio' },
    { to: '/veterinario/citas', label: 'Citas' },
    { to: '/veterinario/historial', label: 'Diagnósticos' },
  ],
  RECEPCION: [
    { to: '/recepcion', label: 'Inicio' },
    { to: '/recepcion/clientes', label: 'Clientes' },
    { to: '/recepcion/agendar', label: 'Agendar cita' },
    { to: '/recepcion/citas', label: 'Citas' },
  ],
  ADMIN: [
    { to: '/admin', label: 'Inicio' },
    { to: '/admin/veterinarios', label: 'Veterinarios' },
    { to: '/admin/recepcionistas', label: 'Recepcionistas' },
  ],
}

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null
  const items = NAV[user.role]

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-brand-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <div className="flex items-center gap-2 font-semibold text-brand-700">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">4k</span>
            Veterinaria 4K
          </div>
          <nav className="flex flex-1 flex-wrap items-center gap-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.split('/').length <= 2}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-100 text-brand-800' : 'text-brand-600 hover:bg-brand-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm leading-tight">
              <div className="font-medium text-brand-800">{user.nombre}</div>
              <div className="text-xs text-brand-400">{ROLE_LABEL[user.role]}</div>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
