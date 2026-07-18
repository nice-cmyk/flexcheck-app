import { useCallback, useEffect, useState } from 'react'
import { getProfile, Profile } from '../lib/supabase'
import { totalCredits } from '../lib/credits'

export function useCredits(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) {
      setProfile(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const p = await getProfile(userId)
    setProfile(p)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    profile,
    loading,
    credits: profile ? totalCredits(profile) : 0,
    refresh,
  }
}
