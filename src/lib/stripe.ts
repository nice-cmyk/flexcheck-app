import { loadStripe, Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  }
  return stripePromise
}

export type PlanId = 'starter' | 'flex' | 'pro'
export type PackId = 'pack5' | 'pack15' | 'pack40'

export const PLANS: Record<
  PlanId,
  { label: string; priceLabel: string; credits: number; extraCreditPrice: string; snapTutorial: boolean }
> = {
  // Pricing/credits below are set so that even in the worst case (a user who
  // spends every credit on photo edits only - the most expensive generation
  // type per credit) the plan still nets at least ~$9-10 margin after the
  // real fal.ai API cost and Stripe fees (~2.9% + $0.30). See margin notes.
  starter: { label: 'Starter', priceLabel: '13.99/mo', credits: 4, extraCreditPrice: '$1.60/video', snapTutorial: false },
  flex: { label: 'Flex', priceLabel: '22.99/mo', credits: 15, extraCreditPrice: '$1.25/video', snapTutorial: true },
  pro: { label: 'Pro', priceLabel: '39.99/mo', credits: 35, extraCreditPrice: '$0.99/video', snapTutorial: true },
}

// Same >=$9 worst-case margin floor as PLANS (all credits spent on photos,
// the most expensive generation type per credit, after Stripe's ~2.9%+$0.30
// one-time payment fee). Per-credit price still drops as pack size grows to
// keep a volume-discount incentive.
export const PACKS: Record<PackId, { label: string; priceLabel: string; credits: number; perCredit: string }> = {
  pack5: { label: '5 credits', priceLabel: '$14.99', credits: 5, perCredit: '$3.00' },
  pack15: { label: '15 credits', priceLabel: '$22.99', credits: 15, perCredit: '$1.53' },
  pack40: { label: '40 credits', priceLabel: '$44.99', credits: 40, perCredit: '$1.12' },
}

/**
 * Starts a hosted Stripe subscription checkout.
 * Requires a backend function (e.g. Supabase Edge Function) that creates
 * the payment session server-side with the Stripe secret key.
 */
export async function startSubscriptionCheckout(planId: PlanId, userId: string) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'subscription', planId, userId }),
  })
  const { url } = await res.json()
  window.location.href = url
}

/**
 * Purchases a one-time credit pack.
 */
export async function startPackCheckout(packId: PackId, userId: string) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'payment', packId, userId }),
  })
  const { url } = await res.json()
  window.location.href = url
}
