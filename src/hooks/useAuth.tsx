import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { identifyUser, trackEvent } from '../lib/analytics'
import { registerReferral } from '../lib/referrals'

// Google OAuth leaves the page entirely, so a referral code picked up from
// ?ref= on /signup can't just live in component state - it has to survive
// the round trip through Google. Signup.tsx stashes it here before
// redirecting; onAuthStateChange below consumes and clears it exactly once
// after a real SIGNED_IN event.
const PENDING_REFERRAL_KEY = 'flexcheck_pending_referral'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => ReturnType<typeof supabase.auth.signInWithPassword>
  signUp: (email: string, password: string) => ReturnType<typeof supabase.auth.signUp>
  signInWithGoogle: () => ReturnType<typeof supabase.auth.signInWithOAuth>
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
      if (data.session?.user) identifyUser(data.session.user.id, { email: data.session.user.email })
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) identifyUser(newSession.user.id, { email: newSession.user.email })

      if (event === 'SIGNED_IN' && newSession?.user) {
        const code = localStorage.getItem(PENDING_REFERRAL_KEY)
        if (code) {
          localStorage.removeItem(PENDING_REFERRAL_KEY)
          registerReferral(newSession.user.id, newSession.user.email ?? null, code).catch(() => {})
        }
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signInWithPassword(email: string, password: string) {
    const result = await supabase.auth.signInWithPassword({ email, password })
    if (!result.error) trackEvent('login')
    return result
  }

  async function signUp(email: string, password: string) {
    const result = await supabase.auth.signUp({ email, password })
    if (!result.error) trackEvent('sign_up')
    return result
  }

  // Redirects to Google, then back to /app once Supabase has exchanged the
  // OAuth code for a session (handled automatically by supabase-js via
  // detectSessionInUrl - no separate callback page needed).
  async function signInWithGoogle() {
    trackEvent('begin_google_signin')
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    })
  }

  async function signOut() {
    return supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithPassword, signUp, signInWithGoogle, signOut }}>
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
