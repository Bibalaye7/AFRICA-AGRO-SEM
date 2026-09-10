import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const getErrorMessage = (error: unknown) => {
  if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
    return 'Supabase est inaccessible. Vérifiez l’URL du projet et votre connexion internet.'
  }
  return error instanceof Error ? error.message : 'Une erreur inattendue est survenue.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase n’est pas encore configuré.' }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error ? getErrorMessage(error) : null }
    } catch (error) {
      return { error: getErrorMessage(error) }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabase) return { error: 'Supabase n’est pas encore configuré.' }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      return { error: error ? getErrorMessage(error) : null }
    } catch (error) {
      return { error: getErrorMessage(error) }
    }
  }

  const signOut = async () => {
    if (!supabase) return { error: 'Supabase n’est pas encore configuré.' }
    const { error } = await supabase.auth.signOut()
    return { error: error ? getErrorMessage(error) : null }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        configured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
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
