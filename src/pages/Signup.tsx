import { FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { registerReferral } from '../lib/referrals'
import Button from '../components/ui/Button'

export default function Signup() {
  const { t } = useTranslation()
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const refCodeFromLink = searchParams.get('ref')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState(refCodeFromLink ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await signUp(email, password)
    setLoading(false)
    if (error) {
      console.error('signUp failed', error)
      // Surface Supabase's actual reason (email already used, rate limit,
      // weak/leaked password, etc.) instead of a blanket generic message -
      // otherwise real signup failures are impossible to diagnose remotely.
      setError(error.message || t('signup.error'))
      return
    }
    const code = referralCode.trim()
    if (code && data.user) {
      registerReferral(data.user.id, data.user.email ?? email, code).catch(() => {})
    }
    navigate('/app')
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError(null)
    const code = referralCode.trim()
    if (code) {
      // Google leaves the page entirely, so this can't live in state -
      // useAuth reads and clears it once the session actually comes back.
      localStorage.setItem('flexcheck_pending_referral', code)
    }
    const { error } = await signInWithGoogle()
    if (error) {
      console.error('Google sign-in failed', error)
      setError(error.message || t('signup.error'))
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display font-extrabold text-xl bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
          FlexCheck
        </Link>
        <div className="text-white text-2xl font-display font-bold mt-6">{t('signup.title')}</div>
        {refCodeFromLink && (
          <div className="bg-primary/15 border border-primary/30 text-primary-light text-xs rounded-xl px-3.5 py-2.5 mt-4">
            {t('signup.invited', { code: refCodeFromLink.toUpperCase() })}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="mt-6 w-full flex items-center justify-center gap-2.5 bg-white hover:bg-white/90 disabled:opacity-60 rounded-xl px-4 py-3 text-sm font-semibold text-[#1F1F1F] transition-colors"
        >
          <GoogleIcon />
          {googleLoading ? t('signup.creating') : t('login.continueWithGoogle')}
        </button>

        <div className="flex items-center gap-3 mt-5">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/30 text-xs">{t('login.or')}</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder={t('login.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder={t('login.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary"
          />
          <div>
            <label className="text-white/50 text-xs px-0.5">{t('signup.referralCodeLabel')}</label>
            <input
              type="text"
              placeholder={t('signup.referralCodePlaceholder')}
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary mt-1.5 uppercase placeholder:normal-case"
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? t('signup.creating') : t('common.startForFree')}
          </Button>
        </form>
        <div className="text-white/40 text-sm mt-6 text-center">
          {t('signup.haveAccount')} <Link to="/login" className="text-accent">{t('common.login')}</Link>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="flex-none">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33C2.44 15.98 5.48 18 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  )
}
