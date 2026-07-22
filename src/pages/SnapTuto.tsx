import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { useCredits } from '../hooks/useCredits'
import { SNAP_TUTO_PRICE_LABEL, startSnapTutoCheckout } from '../lib/stripe'

const VIDEO_URL = '/tutorials/tuto-4665501d8fb5c389.mp4'

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4', 'step5'] as const

export default function SnapTuto() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { profile, loading } = useCredits(user?.id)

  const isFlexOrPro = profile?.subscription_plan === 'flex' || profile?.subscription_plan === 'pro'
  const isSubActive = profile?.subscription_status === 'active'
  const unlocked = Boolean(profile?.snap_tuto_purchased) || (isFlexOrPro && isSubActive)

  return (
    <AppLayout>
      <div className="flex-1 px-4 sm:px-6 lg:px-14 py-8 sm:py-11 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="inline-block bg-[#FF3B30]/15 text-[#FF3B30] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              {t('snapTuto.badge')}
            </div>
            <div className="text-white text-[26px] sm:text-[28px] font-semibold font-display">{t('snapTuto.title')}</div>
            <div className="text-white/50 text-sm mt-2.5">{t('snapTuto.subtitle')}</div>
          </div>

          {loading ? (
            <div className="text-white/40 text-sm text-center mt-10">{t('common.loading', { defaultValue: 'Chargement...' })}</div>
          ) : unlocked ? (
            <div className="mt-8">
              <div className="rounded-2xl overflow-hidden bg-black border border-primary/15">
                <video src={VIDEO_URL} controls playsInline className="w-full max-h-[70vh] mx-auto" />
              </div>

              <Card className="p-6 mt-6">
                <div className="text-white font-semibold text-base mb-4">{t('snapTuto.stepsTitle')}</div>
                <ol className="flex flex-col gap-3.5">
                  {STEP_KEYS.map((key, i) => (
                    <li key={key} className="flex gap-3 text-sm text-white/70">
                      <span className="flex-none w-6 h-6 rounded-full bg-primary/20 text-primary-light text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>{t(`snapTuto.${key}`)}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          ) : (
            <div className="mt-8">
              <Card className="p-6 sm:p-8 text-center">
                <div className="text-white/70 text-sm">{t('snapTuto.lockedIntro')}</div>
                <ul className="flex flex-col gap-2.5 mt-5 text-left max-w-sm mx-auto">
                  {STEP_KEYS.map((key) => (
                    <li key={key} className="text-white/35 text-sm blur-[3px] select-none">
                      • {t(`snapTuto.${key}`)}
                    </li>
                  ))}
                </ul>
                <div className="font-display font-bold text-3xl text-white mt-6">{SNAP_TUTO_PRICE_LABEL}</div>
                <div className="text-white/40 text-xs mt-1">{t('snapTuto.oneTime')}</div>
                <Button
                  onClick={() => user && startSnapTutoCheckout(user.id)}
                  disabled={!user}
                  fullWidth
                  className="mt-5"
                >
                  {t('snapTuto.unlockCta')}
                </Button>
                <div className="text-white/40 text-xs mt-4">
                  {t('snapTuto.includedNote')}{' '}
                  <Link to="/app/credits" className="text-accent">{t('snapTuto.upgradeLink')}</Link>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
