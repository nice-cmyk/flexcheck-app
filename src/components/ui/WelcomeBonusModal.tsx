import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'

const CONFETTI_COLORS = ['#7C3AED', '#A855F7', '#FBBF24', '#22D3EE', '#F472B6', '#34D399']

interface ConfettiPiece {
  left: number
  color: string
  delay: number
  duration: number
  rotation: number
  size: number
}

/**
 * One-time celebratory modal shown right after signup to announce the free
 * signup credit (1 credit = 4 photos, granted automatically by the
 * `handle_new_user` DB trigger - see supabase/schema.sql). Also carries the
 * anti-multi-accounting warning so the free-credit hook can't be farmed by
 * repeatedly creating new accounts.
 */
export default function WelcomeBonusModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()

  // Generated once per mount, not on every render, so the burst doesn't
  // visibly "reset" if a parent re-renders while the modal is open.
  const pieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 60 }, () => ({
        left: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.4,
        duration: 2.2 + Math.random() * 1.4,
        rotation: Math.random() * 360,
        size: 6 + Math.random() * 6,
      })),
    []
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="absolute top-[-20px] rounded-sm confetti-piece"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.4,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative bg-surface border border-primary/30 rounded-2xl px-7 py-8 max-w-sm w-full text-center shadow-[0_0_60px_rgba(124,58,237,0.35)]">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles size={26} className="text-primary-light" />
        </div>
        <div className="text-white font-display font-bold text-xl mt-4">{t('welcomeBonus.title')}</div>
        <div className="text-white/60 text-sm mt-3 leading-relaxed">{t('welcomeBonus.warning')}</div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-primary rounded-xl text-white font-semibold text-sm px-6 py-3"
        >
          {t('welcomeBonus.cta')}
        </button>
      </div>
    </div>
  )
}
