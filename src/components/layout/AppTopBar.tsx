import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Link2, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useCredits } from '../../hooks/useCredits'
import { formatCredits } from '../../lib/credits'

export default function AppTopBar() {
  const { user, signOut } = useAuth()
  const { credits } = useCredits(user?.id)
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex-none flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4 border-b border-white/[0.06] bg-gradient-to-b from-primary/10 to-transparent gap-2">
      <Link to="/app" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center flex-none">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="font-display font-extrabold text-base sm:text-lg text-white truncate">Flexcheck</span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3 flex-none">
        <Link
          to="/app/credits"
          className="flex items-center gap-1.5 bg-primary/15 border border-primary/25 text-primary-light text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full whitespace-nowrap"
        >
          <Link2 size={14} />
          {formatCredits(credits)} credits
        </Link>
        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="w-9 h-9 rounded-full border border-white/15 text-white/70 hover:text-white flex items-center justify-center"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  )
}
