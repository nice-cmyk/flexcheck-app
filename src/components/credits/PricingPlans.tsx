import { useTranslation } from 'react-i18next'
import { PLANS, PlanId, startSubscriptionCheckout } from '../../lib/stripe'
import Card from '../ui/Card'

const order: PlanId[] = ['starter', 'flex', 'pro']

export default function PricingPlans({ userId }: { userId?: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col sm:flex-row gap-5 mt-9 sm:items-end">
      {order.map((id) => {
        const plan = PLANS[id]
        const isFlex = id === 'flex'
        const isPro = id === 'pro'
        return (
          <Card
            key={id}
            highlighted={isFlex}
            className={`sm:flex-1 p-6 sm:p-7 relative ${isPro ? 'border-gold/40' : ''}`}
          >
            {isFlex && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-bold px-3.5 py-1 rounded-full">
                {t('credits.mostPopular')}
              </div>
            )}
            {isPro && (
              <div className="absolute top-4 right-4 bg-gold text-bg text-[11px] font-bold px-2.5 py-1 rounded-full">
                {t('credits.pro')}
              </div>
            )}
            <div className="text-white font-semibold text-base">{plan.label}</div>
            <div className="font-display font-bold text-3xl text-white mt-2.5">
              ${plan.priceLabel.split('/')[0]}
              <span className="text-sm text-white/40 font-normal">/mo</span>
            </div>
            <div className="text-white/45 text-sm mt-3.5">✓ {plan.credits} {t('credits.creditsPerMonth')}</div>
            <div className="text-white/45 text-sm mt-1.5">✓ {t('credits.extraCredits')} {plan.extraCreditPrice}</div>
            {plan.snapTutorial && <div className="text-primary-light text-sm mt-1.5">✓ {t('credits.snapTutorial')}</div>}
            {isPro && <div className="text-gold text-sm mt-1.5">✓ {t('credits.hdUnlocked')}</div>}
            <button
              onClick={() => userId && startSubscriptionCheckout(id, userId)}
              className={`mt-5 w-full rounded-xl text-center py-3 text-sm ${
                isFlex
                  ? 'bg-primary text-white font-semibold'
                  : isPro
                  ? 'border border-gold/40 text-gold'
                  : 'border border-white/20 text-white'
              }`}
            >
              {t('credits.choose', { plan: plan.label })}
            </button>
          </Card>
        )
      })}
    </div>
  )
}
