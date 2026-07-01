import { Navigate, Outlet } from 'react-router-dom'
import type { Role } from '@/api/types'
import { useAuth } from '@/auth/useAuth'
import { ROLE_HOME } from '@/auth/roles'

/**
 * Guards a set of routes. Redirects unauthenticated users to /login, and users
 * whose role is not allowed to their own home.
 */
export function ProtectedRoute({ allow }: { allow: Role[] }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!allow.includes(user.role)) return <Navigate to={ROLE_HOME[user.role]} replace />

  return <Outlet />
}
