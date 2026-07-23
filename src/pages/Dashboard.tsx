import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Camera, Video, Lock } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import WelcomeBonusModal from '../components/ui/WelcomeBonusModal'
import { useAuth } from '../hooks/useAuth'
import { useCredits } from '../hooks/useCredits'

const WELCOME_SEEN_KEY = 'flexcheck_welcome_seen'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { profile } = useCredits(user?.id)
  const isFlexOrPro = profile?.subscription_plan === 'flex' || profile?.subscription_plan === 'pro'
  const videoUnlocked = isFlexOrPro && profile?.subscription_status === 'active'

  // Every new signup gets 1 free credit = 4 photos automatically (see
  // handle_new_user() in supabase/schema.sql) - this just surfaces that with
  // a one-time celebratory popup the first time they land on the dashboard,
  // stored per-account so it never shows again after being dismissed.
  const [showWelcome, setShowWelcome] = useState(false)
  useEffect(() => {
    if (!user) return
    const seen = JSON.parse(localStorage.getItem(WELCOME_SEEN_KEY) ?? '[]') as string[]
    if (!seen.includes(user.id)) {
      setShowWelcome(true)
    }
  }, [user])

  function dismissWelcome() {
    if (user) {
      const seen = JSON.parse(localStorage.getItem(WELCOME_SEEN_KEY) ?? '[]') as string[]
      localStorage.setItem(WELCOME_SEEN_KEY, JSON.stringify([...seen, user.id]))
    }
    setShowWelcome(false)
  }

  return (
    <AppLayout>
      {showWelcome && <WelcomeBonusModal onClose={dismissWelcome} />}
      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-8 sm:py-10 max-w-3xl w-full mx-auto">
        <div className="font-display font-extrabold text-3xl sm:text-4xl text-white">{t('dashboard.title')}</div>
        <div className="text-white/50 text-base mt-2">{t('dashboard.subtitle')}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link
            to="/app/edit-photo"
            className="relative overflow-hidden bg-surface/80 border border-primary/25 rounded-2xl p-6 hover:border-primary/50 transition-colors"
          >
            <div
              className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)' }}
            />
            <div className="relative flex items-start justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Camera size={20} className="text-primary-light" />
              </div>
              <div className="text-white/50 text-sm">{t('dashboard.photoCost')}</div>
            </div>
            <div className="relative text-white font-display font-bold text-2xl mt-5">{t('dashboard.photoTitle')}</div>
            <div className="relative text-white/50 text-sm mt-2 leading-relaxed">
              {t('dashboard.photoDesc')}
            </div>
          </Link>

          <Link
            to="/app/edit-video"
            className="relative overflow-hidden bg-surface/60 border border-white/10 rounded-2xl p-6 hover:border-white/25 transition-colors"
          >
            <div className="relative flex items-start justify-between">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Video size={20} className="text-primary-light" />
              </div>
              <div className="text-white/50 text-sm">{t('dashboard.videoCost')}</div>
            </div>
            <div className="relative text-white font-display font-bold text-2xl mt-5">{t('dashboard.videoTitle')}</div>
            <div className="relative text-white/50 text-sm mt-2 leading-relaxed">
              {t('dashboard.videoDesc')}
            </div>
            {videoUnlocked ? (
              <div className="relative inline-block bg-gold/10 text-gold text-xs font-medium px-3 py-1.5 rounded-full mt-4">
                {t('landing.videoBetaNotice')}
              </div>
            ) : (
              <div className="relative inline-flex items-center gap-1.5 bg-white/[0.06] text-white/50 text-xs font-medium px-3 py-1.5 rounded-full mt-4">
                <Lock size={11} />
                {t('dashboard.videoLockedBadge')}
              </div>
            )}
          </Link>
        </div>

        <div className="text-white/35 text-xs leading-relaxed mt-6">
          {t('dashboard.note')}
        </div>
      </div>
    </AppLayout>
  )
}
