import { loadStripe, Stripe } from '@stripe/stripe-js'
import { trackEvent } from './analytics'

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
  {
    label: string
    priceLabel: string
    credits: number
    extraCreditPrice: string
    snapTutorial: boolean
    /** If set, the plan card shows "N photos to generate/mo" instead of the
     * raw credit count - only valid for plans where video is locked out
     * (video is gated to flex/pro, see EditVideo.tsx/LuxuryCar.tsx), so
     * "credits" and "photos" are actually interchangeable for the user. */
    photosPerMonth?: number
  }
> = {
  // Pricing/credits set from the real fal.ai cost of a photo edit
  // (openai/gpt-image-2/edit, quality "high": ~$0.178-$0.234 per portrait
  // image depending on exact size, ~$0.20 working estimate - see
  // https://fal.ai/models/openai/gpt-image-2/edit for the official grid) and
  // of a short/long Kling video (fal-ai/kling-video/v2.5-turbo/pro:
  // $0.35 for 5s + $0.07/extra second, ~$0.55-$0.76 incl. the reference
  // photo edit step). Worst case per plan = every credit spent on photos
  // only (the most expensive generation type per credit: ~$0.80/credit vs
  // ~$0.43-0.44/credit for video), after Stripe's ~2.9%+$0.30 fee:
  //   starter: 18 photos (4.5cr) -> ~$3.60 cost, $11.99 -> ~$7.74 margin (68%)
  //   flex:    15cr              -> ~$12.00 cost, $19.99 -> ~$7.11 margin (36%)
  //   pro:     35cr              -> ~$28.00 cost, $37.99 -> ~$8.60 margin (23%)
  starter: { label: 'Starter', priceLabel: '11.99/mo', credits: 4.5, extraCreditPrice: '$1.60/video', snapTutorial: false, photosPerMonth: 18 },
  flex: { label: 'Flex', priceLabel: '19.99/mo', credits: 15, extraCreditPrice: '$1.25/video', snapTutorial: true },
  pro: { label: 'Pro', priceLabel: '37.99/mo', credits: 35, extraCreditPrice: '$0.99/video', snapTutorial: true },
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

// Achat unique du tuto "Snap Rouge" (déjà inclus gratuitement dans les plans
// Flex/Pro, voir PLANS.snapTutorial ci-dessus). Vendu séparément pour les
// abonnés Starter ou les gens qui ne veulent pas d'abonnement du tout.
export const SNAP_TUTO_PRICE_LABEL = '9€'

/**
 * Starts a hosted Stripe subscription checkout.
 * Requires a backend function (e.g. Supabase Edge Function) that creates
 * the payment session server-side with the Stripe secret key.
 */
export async function startSubscriptionCheckout(planId: PlanId, userId: string) {
  trackEvent('begin_checkout', { mode: 'subscription', plan: planId })
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
  trackEvent('begin_checkout', { mode: 'payment', pack: packId })
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'payment', packId, userId }),
  })
  const { url } = await res.json()
  window.location.href = url
}

/**
 * Purchases the standalone Snap Rouge tutorial (one-time, 9€), independent
 * of any subscription plan.
 */
export async function startSnapTutoCheckout(userId: string) {
  trackEvent('begin_checkout', { mode: 'payment', item: 'snap_tuto' })
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'payment', itemId: 'snap_tuto', userId }),
  })
  const { url } = await res.json()
  window.location.href = url
}
