import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'

export type Role = 'agent' | 'admin'
export type User = { id: string; email: string; full_name: string; role: Role }

type Me = { user: User | null; needsSetup: boolean; setupAllowed: boolean }

type AuthContextValue = {
  user: User | null
  isStaff: boolean
  loading: boolean
  /** Aucun compte n'existe encore dans la base. */
  needsSetup: boolean
  /** La création du premier compte est possible (uniquement depuis l'ordinateur local). */
  setupAllowed: boolean
  /** Le serveur ou la base ne répond pas. */
  unavailable: string | null
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  setup: (fullName: string, email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const message = (err: unknown) => (err instanceof Error ? err.message : 'Une erreur inattendue est survenue.')

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me>({ user: null, needsSetup: false, setupAllowed: false })
  const [loading, setLoading] = useState(true)
  const [unavailable, setUnavailable] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setMe(await api<Me>('auth/me'))
      setUnavailable(null)
    } catch (err) {
      setMe({ user: null, needsSetup: false, setupAllowed: false })
      setUnavailable(message(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await api<{ user: User }>('auth/login', { method: 'POST', body: { email, password } })
      setMe({ user, needsSetup: false, setupAllowed: false })
      return { error: null }
    } catch (err) {
      return { error: message(err) }
    }
  }

  const setup = async (full_name: string, email: string, password: string) => {
    try {
      const { user } = await api<{ user: User }>('auth/setup', { method: 'POST', body: { full_name, email, password } })
      setMe({ user, needsSetup: false, setupAllowed: false })
      return { error: null }
    } catch (err) {
      return { error: message(err) }
    }
  }

  const signOut = async () => {
    await api('auth/logout', { method: 'POST' }).catch(() => undefined)
    setMe((prev) => ({ ...prev, user: null }))
  }

  return (
    <AuthContext.Provider
      value={{
        user: me.user,
        isStaff: Boolean(me.user),
        loading,
        needsSetup: me.needsSetup,
        setupAllowed: me.setupAllowed,
        unavailable,
        signIn,
        setup,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
