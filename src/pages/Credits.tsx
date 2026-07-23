import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import PricingPlans from '../components/credits/PricingPlans'
import CreditPacks from '../components/credits/CreditPacks'
import Card from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { useCredits } from '../hooks/useCredits'

export default function Credits() {
  const { t } = useTranslation()
  const { user } = useAuth()
  // Credit packs are top-ups meant to extend an existing subscription, not a
  // standalone way to get credits - only subscribers (active status) can buy
  // them, matching how it's sold everywhere else in the app.
  const { profile } = useCredits(user?.id)
  const isSubscribed = profile?.subscription_status === 'active'
  const [tab, setTab] = useState<'plans' | 'packs'>('plans')

  return (
    <AppLayout>
      <div className="flex-1 px-4 sm:px-6 lg:px-14 py-8 sm:py-11 overflow-y-auto">
        <div className="text-center">
          <div className="text-white text-[28px] font-semibold font-display">{t('credits.choosePlan')}</div>
          <div className="inline-flex gap-1 bg-surface/80 border border-primary/15 rounded-full p-1 mt-4.5">
            <button
              onClick={() => setTab('plans')}
              className={`text-[13px] font-semibold px-4.5 py-2.5 rounded-full ${
                tab === 'plans' ? 'bg-primary text-white' : 'text-white/50'
              }`}
            >
              {t('credits.subscriptions')}
            </button>
            <button
              onClick={() => setTab('packs')}
              className={`text-[13px] font-semibold px-4.5 py-2.5 rounded-full ${
                tab === 'packs' ? 'bg-primary text-white' : 'text-white/50'
              }`}
            >
              {t('credits.creditPacks')}
            </button>
          </div>
        </div>

        {tab === 'plans' ? (
          <PricingPlans userId={user?.id} />
        ) : isSubscribed ? (
          <CreditPacks userId={user?.id} />
        ) : (
          <Card className="max-w-md mx-auto mt-9 p-7 text-center">
            <Lock size={20} className="mx-auto text-white/40" />
            <div className="text-white font-semibold text-base mt-3">{t('credits.packsLockedTitle')}</div>
            <div className="text-white/50 text-sm mt-2">{t('credits.packsLockedDesc')}</div>
            <button
              onClick={() => setTab('plans')}
              className="mt-5 bg-primary rounded-xl text-white font-semibold text-sm px-6 py-3"
            >
              {t('credits.packsLockedCta')}
            </button>
          </Card>
        )}

        <div className="flex justify-center flex-wrap gap-4 mt-8">
          <div className="bg-success/15 text-success text-xs font-semibold px-3.5 py-2 rounded-full">
            {t('credits.neverExpire')}
          </div>
          <div className="text-white/40 text-xs px-3.5 py-2">{t('credits.paymentMethods')}</div>
        </div>

        <div className="flex justify-center mt-4">
          <Link
            to="/app/snap-tuto"
            className="border border-[#FF3B30]/30 text-[#FDE047] text-xs font-semibold px-4 py-2.5 rounded-full"
          >
            {t('credits.snapTutorial')} →
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
