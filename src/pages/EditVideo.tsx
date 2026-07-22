import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppLayout from '../components/layout/AppLayout'
import PhotoUpload from '../components/generation/PhotoUpload'
import PromptInput from '../components/generation/PromptInput'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { useCredits } from '../hooks/useCredits'
import { videoTotalCost, formatCredits } from '../lib/credits'
import type { VideoDuration } from '../hooks/useGeneration'
import type { OutputFormat } from '../lib/fal'

const quickPrompts = ['Ferrari 488 cockpit', 'Monaco yacht', 'Dubai rooftop', 'Private jet']

export default function EditVideo() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { profile, loading } = useCredits(user?.id)
  const navigate = useNavigate()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState<VideoDuration>('short')
  const [format, setFormat] = useState<OutputFormat>('vertical')

  function handleSubmit() {
    if (!user || !photoUrl || !prompt) return
    navigate('/app/generating/new', { state: { type: 'video', photoUrl, prompt, duration, format } })
  }

  // Video generation is the expensive/beta path - only opened up to the two
  // paid subscription tiers (flex, pro), not starter or unsubscribed users.
  const isFlexOrPro = profile?.subscription_plan === 'flex' || profile?.subscription_plan === 'pro'
  const isSubActive = profile?.subscription_status === 'active'
  const unlocked = isFlexOrPro && isSubActive

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
          {t('common.loading', { defaultValue: 'Chargement...' })}
        </div>
      </AppLayout>
    )
  }

  if (!unlocked) {
    return (
      <AppLayout>
        <div className="flex-1 px-4 sm:px-6 lg:px-14 py-10 flex items-center justify-center">
          <Card className="p-6 sm:p-8 text-center max-w-md w-full">
            <div className="text-white font-semibold text-lg">{t('editVideo.lockedTitle')}</div>
            <div className="text-white/50 text-sm mt-2.5">{t('editVideo.lockedDesc')}</div>
            <Link
              to="/app/credits"
              className="inline-block mt-6 bg-primary rounded-xl text-white font-semibold text-sm px-6 py-3"
            >
              {t('editVideo.lockedCta')}
            </Link>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
        <div className="flex-none lg:w-[500px] p-4 sm:p-6 lg:p-8 box-border lg:border-r border-white/[0.06] lg:overflow-y-auto">
          <div className="text-white text-xl font-semibold">{t('editVideo.title')}</div>
          <div className="text-white/45 text-sm mt-1.5">{t('editVideo.subtitle')}</div>

          <div className="mt-5">
            <PhotoUpload onFileSelected={(_f, url) => setPhotoUrl(url)} />
          </div>

          <div className="text-white/70 text-sm font-semibold mt-6">{t('editVideo.describeScene')}</div>
          <div className="mt-2.5">
            <PromptInput value={prompt} onChange={setPrompt} quickPrompts={quickPrompts} />
          </div>

          <div className="text-white/70 text-sm font-semibold mt-6">{t('editVideo.duration')}</div>
          <div className="flex gap-2.5 mt-2.5">
            <button
              type="button"
              onClick={() => setDuration('short')}
              className={`flex-1 rounded-xl border py-3 text-sm text-center ${
                duration === 'short' ? 'border-primary bg-primary/15 text-white' : 'border-white/15 text-white/50'
              }`}
            >
              {t('editVideo.short')}
              <div className="text-xs mt-0.5 opacity-70">+{formatCredits(1)} {t('common.credit')}</div>
            </button>
            <button
              type="button"
              onClick={() => setDuration('long')}
              className={`flex-1 rounded-xl border py-3 text-sm text-center ${
                duration === 'long' ? 'border-primary bg-primary/15 text-white' : 'border-white/15 text-white/50'
              }`}
            >
              {t('editVideo.long')}
              <div className="text-xs mt-0.5 opacity-70">+{formatCredits(1.5)} {t('common.credit')}</div>
            </button>
          </div>

          <div className="text-white/70 text-sm font-semibold mt-6">{t('common.format')}</div>
          <div className="flex gap-2.5 mt-2.5">
            <button
              type="button"
              onClick={() => setFormat('vertical')}
              className={`flex-1 rounded-xl border py-3 text-sm text-center ${
                format === 'vertical' ? 'border-primary bg-primary/15 text-white' : 'border-white/15 text-white/50'
              }`}
            >
              {t('common.vertical')}
              <div className="text-xs mt-0.5 opacity-70">{t('common.verticalDesc')}</div>
            </button>
            <button
              type="button"
              onClick={() => setFormat('square')}
              className={`flex-1 rounded-xl border py-3 text-sm text-center ${
                format === 'square' ? 'border-primary bg-primary/15 text-white' : 'border-white/15 text-white/50'
              }`}
            >
              {t('common.square')}
              <div className="text-xs mt-0.5 opacity-70">{t('common.squareDesc')}</div>
            </button>
          </div>

          <Button fullWidth className="mt-6" onClick={handleSubmit}>
            {t('editVideo.generateVideo')}
          </Button>
          <div className="text-center text-white/40 text-xs mt-2">
            {t('editVideo.usesCredit', { n: formatCredits(videoTotalCost(duration)) })}
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[240px] sm:min-h-[280px]">
          <div className="w-full h-full rounded-2xl bg-surface/60 border border-primary/15 flex items-center justify-center text-white/30 text-sm">
            {photoUrl ? (
              <img src={photoUrl} alt="Preview" className="max-h-full max-w-full rounded-2xl object-contain" />
            ) : (
              t('common.yourVideoHere')
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
