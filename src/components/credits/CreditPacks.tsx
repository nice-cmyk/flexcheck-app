import { useTranslation } from 'react-i18next'
import { PACKS, PackId, startPackCheckout } from '../../lib/stripe'
import Card from '../ui/Card'

const order: PackId[] = ['pack5', 'pack15', 'pack40']

export default function CreditPacks({ userId }: { userId?: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col sm:flex-row gap-5 mt-9">
      {order.map((id) => {
        const pack = PACKS[id]
        return (
          <Card key={id} className="sm:flex-1 p-6 sm:p-7">
            <div className="text-white font-semibold text-base">{pack.label}</div>
            <div className="font-display font-bold text-3xl text-white mt-2.5">{pack.priceLabel}</div>
            <div className="text-white/45 text-sm mt-3.5">{pack.perCredit} {t('credits.perCredit')}</div>
            <button
              onClick={() => userId && startPackCheckout(id, userId)}
              className="mt-5 w-full rounded-xl text-center py-3 text-sm border border-white/20 text-white"
            >
              {t('common.buy')}
            </button>
          </Card>
        )
      })}
    </div>
  )
}
