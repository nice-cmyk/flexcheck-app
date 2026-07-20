import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CreditsBar from './CreditsBar'
import { useAuth } from '../../hooks/useAuth'
import { useCredits } from '../../hooks/useCredits'

export default function Sidebar() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { credits } = useCredits(user?.id)
  const displayName = user?.email?.split('@')[0] ?? 'User'

  const links = [
    { to: '/app', label: t('sidebar.home'), end: true },
    { to: '/app/edit-photo', label: t('sidebar.editPhoto') },
    { to: '/app/edit-video', label: t('sidebar.editVideo') },
    { to: '/app/luxury-car', label: t('sidebar.luxuryCar') },
    { to: '/app/change-scene', label: t('sidebar.changeScene') },
    { to: '/app/creations', label: t('sidebar.myCreations') },
    { to: '/app/credits', label: t('sidebar.credits') },
  ]

  return (
    <div className="flex-none w-60 bg-sidebar border-r border-white/[0.06] flex flex-col p-4 box-border">
      <div className="font-display font-extrabold text-lg bg-gradient-to-br from-primary to-primary-light bg-clip-text text-transparent px-2 pb-6">
        FlexCheck
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `text-sm px-2 py-2.5 rounded-lg ${isActive ? 'text-white bg-white/[0.04]' : 'text-white/40 hover:text-white/70'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <CreditsBar credits={credits} />
        <div className="flex items-center gap-2.5 mt-4 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light" />
          <div className="text-white text-sm font-medium capitalize">{displayName}</div>
        </div>
      </div>
    </div>
  )
}
