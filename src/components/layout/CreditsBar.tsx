import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CreditsBar({ credits }: { credits: number }) {
  const { t } = useTranslation()
  return (
    <div className="bg-primary/10 border border-primary/25 rounded-2xl p-3.5">
      <div className="text-primary-light text-sm font-semibold">
        {credits} {credits > 1 ? t('common.credits') : t('common.credit')}
      </div>
      <Link
        to="/app/credits"
        className="mt-2 block bg-primary text-center text-white text-xs font-semibold py-2 rounded-lg"
      >
        {t('sidebar.topUp')}
      </Link>
    </div>
  )
}
