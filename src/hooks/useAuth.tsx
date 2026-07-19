import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => ReturnType<typeof supabase.auth.signInWithPassword>
  signUp: (email: string, password: string) => ReturnType<typeof supabase.auth.signUp>
  signOut: () => ReturnType<typeof supabase.auth.signOut>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Single shared source of truth for the auth session.
 *
 * Previously every component called its own independent useAuth() hook, each
 * running its own async supabase.auth.getSession() call. This caused a race
 * condition: a page like Generating could start its own auth check, get
 * `userId === undefined` for a brief moment before that check resolved, and
 * bail out of the generation (since it can't run without a user id) before
 * the real, already-confirmed session (from AuthGuard) was actually ready.
 * The generation would then silently never start, leaving the UI stuck at
 * 0%. A single AuthProvider fixes this: everyone reads the exact same,
 * already-resolved state at the same time.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signInWithPassword(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password })
  }

  async function signOut() {
    return supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithPassword, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
