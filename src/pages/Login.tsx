import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'

export default function Login() {
  const { t } = useTranslation()
  const { signInWithPassword } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signInWithPassword(email, password)
    setLoading(false)
    if (error) {
      setError(t('login.error'))
      return
    }
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display font-extrabold text-xl bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent">
          FlexCheck
        </Link>
        <div className="text-white text-2xl font-display font-bold mt-6">{t('login.title')}</div>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
            placeholder={t('login.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary"
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? t('login.loggingIn') : t('login.title')}
          </Button>
        </form>
        <div className="text-white/40 text-sm mt-6 text-center">
          {t('login.noAccount')} <Link to="/signup" className="text-accent">{t('login.createAccount')}</Link>
        </div>
      </div>
    </div>
  )
}
