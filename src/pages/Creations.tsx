import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { supabase, Generation } from '../lib/supabase'

export default function Creations() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [items, setItems] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('generations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setItems((data as Generation[]) ?? [])
        setLoading(false)
      })
  }, [user])

  return (
    <AppLayout>
      <div className="flex-1 p-4 sm:p-6 lg:p-11">
        <div className="text-white text-2xl font-semibold">{t('creations.title')}</div>
        <div className="text-white/45 text-sm mt-1.5">{t('creations.subtitle')}</div>

        {loading && <div className="text-white/40 text-sm mt-8">{t('common.loading')}</div>}

        {!loading && items.length === 0 && (
          <div className="text-white/40 text-sm mt-8">
            {t('creations.empty')}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
          {items.map((g) => (
            <div key={g.id}>
              <div className="aspect-[9/16] rounded-2xl bg-gradient-to-br from-[#2a1a3d] to-[#0f0a18] border border-primary/20 overflow-hidden">
                {g.final_url && (
                  g.type === 'video' ? (
                    <video src={g.final_url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={g.final_url} alt={g.user_prompt} className="w-full h-full object-cover" />
                  )
                )}
              </div>
              <div className="text-white text-xs mt-1.5 truncate">{g.user_prompt}</div>
              <div className="text-white/40 text-[11px]">{new Date(g.created_at).toLocaleDateString('en-US')}</div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
