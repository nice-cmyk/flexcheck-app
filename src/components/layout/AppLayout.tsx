import { ReactNode } from 'react'
import AppTopBar from './AppTopBar'
import AppBottomNav from './AppBottomNav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg min-h-screen flex flex-col">
      <AppTopBar />
      <div className="flex-1 flex flex-col pb-28">{children}</div>
      <AppBottomNav />
    </div>
  )
}
