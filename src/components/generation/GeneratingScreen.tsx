import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GenerationStep } from '../../hooks/useGeneration'

const order: GenerationStep[] = ['analyzing', 'uploading', 'composing', 'rendering_video', 'finalizing']

export default function GeneratingScreen({ step, progress }: { step: GenerationStep; progress: number }) {
  const { t } = useTranslation()
  const stepLabels: Record<GenerationStep, string> = {
    idle: '',
    analyzing: t('generatingScreen.steps.analyzing'),
    uploading: t('generatingScreen.steps.uploading'),
    composing: t('generatingScreen.steps.composing'),
    rendering_video: t('generatingScreen.steps.rendering_video'),
    finalizing: t('generatingScreen.steps.finalizing'),
    complete: t('generatingScreen.steps.complete'),
    failed: t('generatingScreen.steps.failed'),
  }
  const currentIndex = order.indexOf(step)

  // The real `progress` value jumps in big steps (10 -> 25 -> 55 -> 80 -> 95 -> 100)
  // and can sit at the same number for 10-20s while fal.ai renders, which looks
  // frozen/stuck to the user. `display` instead creeps forward continuously on
  // its own between real updates, so the bar is always visibly moving, while
  // still snapping ahead whenever a real step completes and jumping to 100
  // only once the generation is actually done.
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setDisplay((d) => {
        if (step === 'complete') return 100
        if (step === 'failed') return d
        const cap = Math.min(98, progress + 6)
        return d < cap ? Math.min(cap, d + 0.5) : d
      })
    }, 100)
    return () => clearInterval(id)
  }, [step, progress])

  const shownProgress = Math.round(display)

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] rounded-full relative"
        style={{
          border: '5px solid rgba(124,58,237,0.15)',
          borderTopColor: '#A855F7',
          boxShadow: '0 0 50px rgba(124,58,237,0.3)',
        }}
      >
        <div className="absolute inset-4 rounded-full overflow-hidden flex">
          <div className="flex-1 bg-[#1a1a24]" />
          <div className="flex-1 bg-gradient-to-br from-[#2a1a3d] to-[#0f0a18]" />
        </div>
      </div>

      <div className="text-white text-xl mt-8">{t('generatingScreen.transforming')}</div>
      <div className="font-display font-bold text-4xl bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent mt-2">
        {shownProgress}%
      </div>

      <div className="flex flex-col gap-2.5 mt-7">
        {order.map((s, i) => {
          const done = i < currentIndex || step === 'complete'
          const active = i === currentIndex && step !== 'complete'
          return (
            <div
              key={s}
              className={`text-sm flex items-center gap-2 ${
                done ? 'text-success' : active ? 'text-primary-light' : 'text-white/35'
              }`}
            >
              {done ? '✓' : active ? '⟳' : '○'} {stepLabels[s]}
              {active && <span className="w-2 h-2 rounded-full bg-primary-light animate-pulse-dot" />}
            </div>
          )
        })}
      </div>

      <div className="w-full max-w-[340px] h-1 bg-primary/15 rounded-full mt-7 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-primary-light" style={{ width: `${shownProgress}%` }} />
      </div>
      <div className="text-white/35 text-xs mt-3.5">{t('generatingScreen.note')}</div>
    </div>
  )
}
