import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Wand2, History, CreditCard, Gift, User } from 'lucide-react'

export default function AppBottomNav() {
  const { t } = useTranslation()
  const items = [
    { to: '/app', label: t('bottomnav.create'), icon: Wand2, end: true },
    { to: '/app/creations', label: t('bottomnav.history'), icon: History },
    { to: '/app/credits', label: t('bottomnav.subscription'), icon: CreditCard },
    { to: '/app/affiliate', label: t('bottomnav.referrals'), icon: Gift },
    { to: '/app/account', label: t('bottomnav.account'), icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 px-3 bg-gradient-to-t from-bg via-bg/90 to-transparent pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-0.5 sm:gap-1 bg-surface/95 border border-white/10 rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] max-w-full overflow-x-auto">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className={({ isActive }) =>
              `flex-none flex items-center gap-1.5 text-xs font-medium px-2.5 sm:px-3 py-2.5 rounded-full transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-white/50 hover:text-white'
              }`
            }
          >
            <Icon size={16} className="flex-none" />
            <span className="hidden sm:inline">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
