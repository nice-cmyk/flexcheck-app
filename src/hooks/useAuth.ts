import { useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
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

  return { user, session, loading, signInWithPassword, signUp, signOut }
}
