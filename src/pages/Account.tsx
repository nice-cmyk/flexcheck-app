import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CreditCard, Gift, LogOut, ChevronRight, Globe } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { useCredits } from '../hooks/useCredits'
import { formatCredits } from '../lib/credits'
import { supportedLanguages } from '../i18n'

export default function Account() {
  const { t, i18n } = useTranslation()
  const { user, signOut } = useAuth()
  const { credits, profile } = useCredits(user?.id)
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <AppLayout>
      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-8 sm:py-10 max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-light" />
          <div>
            <div className="text-white font-display font-bold text-2xl">
              {user?.email?.split('@')[0] ?? 'User'}
            </div>
            <div className="text-white/45 text-sm">{user?.email}</div>
          </div>
        </div>

        <div className="bg-surface/70 border border-primary/20 rounded-2xl p-5 mt-7 flex items-center justify-between">
          <div>
            <div className="text-white/50 text-xs uppercase tracking-wide">{t('account.currentBalance')}</div>
            <div className="font-display font-bold text-3xl text-white mt-1">
              {formatCredits(credits)} <span className="text-base font-normal text-white/50">{t('common.credits')}</span>
            </div>
            {profile?.subscription_plan && (
              <div className="text-primary-light text-xs mt-1 capitalize">
                {profile.subscription_plan} {t('account.subscription')} · {profile.subscription_status === 'active' ? t('account.active') : t('account.inactive')}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mt-6">
          <AccountLink to="/app/credits" icon={CreditCard} title={t('account.manageSubscription')} desc={t('account.manageSubscriptionDesc')} />
          <AccountLink to="/app/affiliate" icon={Gift} title={t('account.referralProgram')} desc={t('account.referralProgramDesc')} />
        </div>

        <div className="bg-surface/60 border border-white/10 rounded-2xl p-4 mt-2.5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center flex-none">
            <Globe size={18} className="text-primary-light" />
          </div>
          <div className="flex-1">
            <div className="text-white text-sm font-semibold">{t('account.language')}</div>
            <div className="text-white/45 text-xs mt-0.5">{t('account.languageDesc')}</div>
          </div>
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-bg border border-white/15 rounded-lg text-white text-sm px-2.5 py-2 outline-none focus:border-primary"
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 text-white/50 hover:text-white text-sm mt-8 px-1"
        >
          <LogOut size={16} />
          {t('common.logout')}
        </button>
      </div>
    </AppLayout>
  )
}

function AccountLink({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string
  icon: typeof CreditCard
  title: string
  desc: string
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 bg-surface/60 border border-white/10 rounded-2xl p-4 hover:border-primary/40 transition-colors"
    >
      <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center flex-none">
        <Icon size={18} className="text-primary-light" />
      </div>
      <div className="flex-1">
        <div className="text-white text-sm font-semibold">{title}</div>
        <div className="text-white/45 text-xs mt-0.5">{desc}</div>
      </div>
      <ChevronRight size={18} className="text-white/30" />
    </Link>
  )
}
