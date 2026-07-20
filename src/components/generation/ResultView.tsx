import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'
import { formatCredits } from '../../lib/credits'

interface ResultViewProps {
  beforeUrl: string
  afterUrl: string
  sceneUsed: string
  creditsUsed: number
  generationTimeSec: number
  prompt: string
  creditsLeft: number
  isVideo?: boolean
}

export default function ResultView({
  beforeUrl, afterUrl, sceneUsed, creditsUsed, generationTimeSec, prompt, creditsLeft, isVideo,
}: ResultViewProps) {
  const { t } = useTranslation()
  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
      <div className="flex-none w-full lg:w-[700px] p-4 sm:p-8 box-border">
        <div className="h-[70vh] lg:h-full flex gap-3">
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-black">
            <img src={beforeUrl} alt="Before" className="w-full h-full object-cover" />
            <div className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">{t('result.before')}</div>
          </div>
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-black">
            {isVideo ? (
              <video src={afterUrl} className="w-full h-full object-contain bg-black" autoPlay loop muted controls playsInline />
            ) : (
              <img src={afterUrl} alt="After" className="w-full h-full object-cover" />
            )}
            <div className="absolute top-2.5 left-2.5 bg-primary/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">{t('result.after')}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-8 box-border">
        <div className="text-white text-xl font-semibold">{t('result.ready')}</div>

        <div className="bg-surface/80 border border-primary/15 rounded-2xl p-4 mt-4">
          <Row label={t('result.sceneUsed')} value={sceneUsed} />
          <Row label={t('result.creditsUsed')} value={formatCredits(creditsUsed)} />
          <Row label={t('result.genTime')} value={`${generationTimeSec}s`} last />
        </div>

        <div className="flex flex-col gap-2.5 mt-4">
          <Button>{t('result.save')}</Button>
          <Button variant="ghost">{t('result.instaStory')}</Button>
          <button className="border border-[#F5CB0A]/40 rounded-xl text-center text-[#FDE047] text-sm py-3">
            {t('result.snapchat')}
          </button>
          <Button variant="ghost">{t('result.copyLink')}</Button>
        </div>

        <div className="text-white/40 text-xs mt-4">{t('result.youAsked')}</div>
        <div className="text-white/55 text-xs italic mt-1">"{prompt}"</div>

        <div className="bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/30 rounded-2xl p-3.5 mt-5 text-white text-sm">
          {t('result.creditsLeft', { n: formatCredits(creditsLeft), s: creditsLeft > 1 ? 's' : '' })} · <a href="/app/credits">{t('result.topUp')}</a>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex justify-between text-white/50 text-sm ${last ? '' : 'mb-2'}`}>
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  )
}
