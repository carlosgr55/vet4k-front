import { createContext } from 'react'
import type { AuthUser } from '@/api/types'

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (usuario: string, password: string) => Promise<AuthUser>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
