import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="relative border-t border-white/[0.06] px-4 sm:px-6 lg:px-14 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-white/40 text-xs">
          <span className="font-display font-bold text-white/70">FlexCheck</span>
          <span>© {new Date().getFullYear()}. {t('footer.rights')}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-white/40 text-xs">
          <Link to="/terms" className="hover:text-white/70">{t('footer.terms')}</Link>
          <Link to="/privacy" className="hover:text-white/70">{t('footer.privacy')}</Link>
          <a href="mailto:contact@flexcheck.app" className="hover:text-white/70">{t('footer.contact')}</a>
        </div>
      </div>
    </footer>
  )
}
