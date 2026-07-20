import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppLayout from '../components/layout/AppLayout'
import PricingPlans from '../components/credits/PricingPlans'
import CreditPacks from '../components/credits/CreditPacks'
import { useAuth } from '../hooks/useAuth'

export default function Credits() {
  const { t } = useTranslation()
  const { user } = useAuth()
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

        {tab === 'plans' ? <PricingPlans userId={user?.id} /> : <CreditPacks userId={user?.id} />}

        <div className="flex justify-center flex-wrap gap-4 mt-8">
          <div className="bg-success/15 text-success text-xs font-semibold px-3.5 py-2 rounded-full">
            {t('credits.neverExpire')}
          </div>
          <div className="text-white/40 text-xs px-3.5 py-2">{t('credits.paymentMethods')}</div>
        </div>
      </div>
    </AppLayout>
  )
}
