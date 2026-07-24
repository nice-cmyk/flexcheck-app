import { useState } from 'react'
import { X } from 'lucide-react'

const SNAP_USERNAME = 'flexchec26'

// Bouton flottant Snapchat, visible sur tout le site (LP + app). Positionné
// au-dessus (bottom-24) du widget de chat public de la landing (qui, lui,
// est fixé en bottom-5) pour ne jamais se superposer avec lui.
export default function SnapButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-24 right-5 z-[70]">
      {open && (
        <div className="mb-3 w-64 bg-surface/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-4">
          <div className="flex items-start justify-between">
            <div className="text-white font-semibold text-sm">Support Snapchat</div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white -mt-1 -mr-1">
              <X size={16} />
            </button>
          </div>
          <div className="text-white/50 text-xs mt-2">Ajoute-nous pour toute question :</div>
          <div className="mt-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center">
            <span className="text-[#FFFC00] font-bold text-base tracking-wide">{SNAP_USERNAME}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Contacter sur Snapchat"
        className="w-14 h-14 rounded-full bg-[#FFFC00] hover:brightness-95 transition-[filter] shadow-[0_4px_20px_rgba(255,252,0,0.45)] flex items-center justify-center"
      >
        {open ? (
          <X size={22} className="text-black" />
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="black" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.03 2c-2.9 0-4.72 2.16-4.72 4.9 0 .5.03 1.1.09 1.66-.24.14-.6.27-1.05.27-.42 0-.77-.13-.99-.24a.6.6 0 0 0-.27-.06.62.62 0 0 0-.62.6c0 .18.06.32.13.44.36.6.36 1.16.24 1.5-.1.28-.34.5-.75.7-.55.27-1.34.5-2.06.68-.3.08-.53.35-.53.66 0 .2.09.38.22.5.5.46 1.4.86 2.4 1.06-.03.14-.08.34-.08.5 0 .3.24.55.55.6.44.06 1.13.24 1.52.6.5.46.98 1.3 2.4 1.9 1.2.5 2.1.5 2.42.5.32 0 1.22 0 2.42-.5 1.42-.6 1.9-1.44 2.4-1.9.39-.36 1.08-.54 1.52-.6a.6.6 0 0 0 .55-.6c0-.16-.05-.36-.08-.5 1-.2 1.9-.6 2.4-1.06.13-.12.22-.3.22-.5 0-.31-.23-.58-.53-.66-.72-.18-1.51-.41-2.06-.68-.41-.2-.65-.42-.75-.7-.12-.34-.12-.9.24-1.5.07-.12.13-.26.13-.44a.62.62 0 0 0-.62-.6.6.6 0 0 0-.27.06c-.22.11-.57.24-.99.24-.45 0-.81-.13-1.05-.27.06-.56.09-1.16.09-1.66C16.75 4.16 14.93 2 12.03 2z" />
          </svg>
        )}
      </button>
    </div>
  )
}
