import { supabase } from './supabase'

export type Referral = {
  id: string
  referrer_id: string
  referred_id: string
  referred_email: string | null
  status: 'pending' | 'rewarded'
  reward_credits: number
  created_at: string
  rewarded_at: string | null
}

export async function getReferralCode(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('profiles').select('referral_code').eq('id', userId).single()
  if (error) return null
  return data?.referral_code ?? null
}

export function getReferralLink(code: string) {
  return `${window.location.origin}/signup?ref=${code}`
}

export async function listMyReferrals(userId: string): Promise<Referral[]> {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data as Referral[]
}

export function referralStats(referrals: Referral[]) {
  const invited = referrals.length
  const rewarded = referrals.filter((r) => r.status === 'rewarded')
  const creditsEarned = rewarded.reduce((sum, r) => sum + Number(r.reward_credits), 0)
  return { invited, rewardedCount: rewarded.length, creditsEarned }
}

/**
 * À appeler juste après l'inscription si un code de parrainage (?ref=) est présent dans l'URL.
 * Enregistre la relation de parrainage. La récompense en crédits n'est attribuée au parrain
 * qu'au premier achat du filleul (voir supabase/functions/stripe-webhook).
 */
export async function registerReferral(newUserId: string, newUserEmail: string | null, code: string): Promise<void> {
  const { data: referrer, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('referral_code', code.toUpperCase())
    .maybeSingle()

  if (error || !referrer || referrer.id === newUserId) return

  await supabase.from('referrals').insert({
    referrer_id: referrer.id,
    referred_id: newUserId,
    referred_email: newUserEmail,
  })

  await supabase.from('profiles').update({ referred_by: referrer.id }).eq('id', newUserId)
}
