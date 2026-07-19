import { supabase } from './supabase'

/** Coûts en crédits (fractions autorisées) */
export const COSTS = {
  photo: 0.25,
  videoReference: 0.25,
  videoShort: 1, // vidéo ≤ 5s, en plus de l'image de référence
  videoLong: 1.5, // vidéo 6-8s, en plus de l'image de référence
} as const

export function videoTotalCost(duration: 'short' | 'long') {
  return COSTS.videoReference + (duration === 'short' ? COSTS.videoShort : COSTS.videoLong)
}

/** Displays a credit amount without trailing zeros (1 instead of 1.00, 1.25 otherwise) */
export function formatCredits(amount: number) {
  if (amount === Infinity) return '∞'
  return Number(amount.toFixed(2)).toString()
}

/**
 * Consomme des crédits : priorité aux crédits d'abonnement, puis aux crédits de pack.
 * Retourne false si le solde est insuffisant.
 *
 * Passe par la fonction Postgres sécurisée `consume_credits` (security definer)
 * plutôt que par un UPDATE direct sur `profiles` : les policies RLS n'autorisent
 * que la lecture pour les utilisateurs, donc c'est la seule voie d'écriture
 * possible. Ça empêche un utilisateur de s'auto-créditer depuis la console du
 * navigateur en appelant directement le SDK Supabase.
 */
export async function useCredits(userId: string, amount: number): Promise<boolean> {
  const { data, error } = await supabase.rpc('consume_credits', {
    p_user_id: userId,
    p_amount: amount,
  })

  if (error) return false
  return data === true
}

export function totalCredits(profile: {
  subscription_credits_remaining: number
  pack_credits: number
  unlimited_credits?: boolean
}) {
  if (profile.unlimited_credits) return Infinity
  return profile.subscription_credits_remaining + profile.pack_credits
}
