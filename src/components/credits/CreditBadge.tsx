import { useTranslation } from 'react-i18next'

export default function CreditBadge({ credits }: { credits: number }) {
  const { t } = useTranslation()
  return (
    <div className="bg-primary/15 border border-primary/30 text-primary-light text-sm font-semibold px-4 py-2.5 rounded-full inline-block">
      {credits} {credits > 1 ? t('common.credits') : t('common.credit')}
    </div>
  )
}
