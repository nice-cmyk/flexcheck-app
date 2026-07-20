import { useTranslation } from 'react-i18next'
import TopNav from '../components/layout/TopNav'
import Footer from '../components/layout/Footer'

export default function Terms() {
  const { t } = useTranslation()
  return (
    <div className="bg-bg min-h-screen flex flex-col">
      <TopNav />
      <div className="flex-1 px-4 sm:px-6 lg:px-14 py-12 max-w-2xl mx-auto w-full">
        <div className="font-display font-extrabold text-3xl text-white">{t('terms.title')}</div>
        <div className="text-white/40 text-sm mt-2">{t('terms.lastUpdated')} {new Date().toLocaleDateString('en-US')}</div>
        <div className="text-white/60 text-sm leading-relaxed mt-8 flex flex-col gap-5">
          <p>{t('terms.p1')}</p>
          <p>{t('terms.p2')}</p>
          <p>{t('terms.p3')}</p>
          <p>{t('terms.p4')}</p>
          <p>{t('terms.p5')}</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
