import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { login as loginRequest } from '@/api/auth'
import type { AuthUser } from '@/api/types'
import { AuthContext } from './AuthContext'

const STORAGE_KEY = 'vet4k.auth'

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const login = useCallback(async (usuario: string, password: string) => {
    setLoading(true)
    try {
      const authUser = await loginRequest({ usuario, password })
      setUser(authUser)
      return authUser
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
