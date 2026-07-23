import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Check } from 'lucide-react'
import { supportedLanguages } from '../../i18n'

export default function LanguageSwitcher({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = supportedLanguages.find((l) => l.code === i18n.language)?.code ?? 'en'

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border whitespace-nowrap ${
          variant === 'dark'
            ? 'border-white/15 text-white/70 hover:text-white'
            : 'border-primary/25 bg-primary/10 text-primary-light'
        }`}
      >
        <Globe size={14} />
        <span className="uppercase">{current}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-surface border border-white/10 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50">
          {supportedLanguages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                i18n.changeLanguage(l.code)
                setOpen(false)
              }}
              className="w-full flex items-center justify-between text-left text-sm text-white/80 hover:bg-white/[0.06] px-3.5 py-2.5"
            >
              {l.label}
              {current === l.code && <Check size={14} className="text-primary-light" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
