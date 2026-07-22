// Supabase Edge Function — webhook Stripe
// Déploiement : supabase functions deploy stripe-webhook
// Variables requises (Supabase secrets) : STRIPEAPI_KEY (déjà présent), STRIPE_WEBHOOK_SECRET,
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@16?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPEAPI_KEY')!, {
  apiVersion: '2024-06-20',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Alignés avec PLANS dans src/lib/stripe.ts (source de vérité pour les crédits/prix affichés).
const PLAN_CREDITS: Record<string, number> = { starter: 7.5, flex: 15, pro: 35 }
const PACK_CREDITS: Record<string, number> = { pack5: 5, pack15: 15, pack40: 40 }

/**
 * Si l'acheteur a été parrainé et que ce parrainage n'a pas encore été récompensé,
 * crédite le parrain et marque le parrainage comme "rewarded". Ne fait rien sinon
 * (déjà récompensé, ou pas de parrain).
 */
async function rewardReferrerIfEligible(userId: string) {
  const { data: referral } = await supabase
    .from('referrals')
    .select('id, referrer_id, reward_credits, status')
    .eq('referred_id', userId)
    .eq('status', 'pending')
    .maybeSingle()

  if (!referral) return

  const { data: referrer } = await supabase
    .from('profiles')
    .select('pack_credits')
    .eq('id', referral.referrer_id)
    .single()

  if (!referrer) return

  await supabase
    .from('profiles')
    .update({ pack_credits: Number(referrer.pack_credits ?? 0) + Number(referral.reward_credits) })
    .eq('id', referral.referrer_id)

  await supabase
    .from('referrals')
    .update({ status: 'rewarded', rewarded_at: new Date().toISOString() })
    .eq('id', referral.id)

  await supabase.from('credit_transactions').insert({
    user_id: referral.referrer_id,
    amount: referral.reward_credits,
    type: 'referral_reward',
    description: 'Récompense de parrainage',
  })
}

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    return new Response(`Signature invalide: ${err}`, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id || session.metadata?.userId
      if (!userId) break

      if (session.metadata?.itemId === 'snap_tuto') {
        await supabase
          .from('profiles')
          .update({ snap_tuto_purchased: true })
          .eq('id', userId)
        await supabase.from('credit_transactions').insert({
          user_id: userId,
          amount: 0,
          type: 'tuto_purchase',
          stripe_payment_intent_id: session.payment_intent as string,
          description: 'Achat du tuto Snap Rouge',
        })
      } else if (session.mode === 'subscription') {
        const planId = session.metadata?.planId ?? 'starter'
        const credits = PLAN_CREDITS[planId] ?? 0
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_plan: planId,
            subscription_credits_remaining: credits,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', userId)
        await supabase.from('credit_transactions').insert({
          user_id: userId,
          amount: credits,
          type: 'subscription',
          stripe_payment_intent_id: session.payment_intent as string,
          description: `Abonnement ${planId} activé`,
        })
      } else {
        const packId = session.metadata?.packId ?? 'pack5'
        const credits = PACK_CREDITS[packId] ?? 0
        const { data: profile } = await supabase
          .from('profiles')
          .select('pack_credits')
          .eq('id', userId)
          .single()
        await supabase
          .from('profiles')
          .update({ pack_credits: (profile?.pack_credits ?? 0) + credits })
          .eq('id', userId)
        await supabase.from('credit_transactions').insert({
          user_id: userId,
          amount: credits,
          type: 'pack_purchase',
          stripe_payment_intent_id: session.payment_intent as string,
          description: `Achat du pack ${packId}`,
        })
      }

      // Programme d'affiliation : récompense le parrain au tout premier achat du filleul
      await rewardReferrerIfEligible(userId)
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('profiles')
        .update({ subscription_status: sub.status === 'active' ? 'active' : 'inactive' })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from('profiles')
        .update({ subscription_status: 'inactive' })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.billing_reason === 'subscription_cycle') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, subscription_plan')
          .eq('stripe_customer_id', invoice.customer as string)
          .single()
        if (profile) {
          const credits = PLAN_CREDITS[profile.subscription_plan ?? 'starter'] ?? 0
          await supabase
            .from('profiles')
            .update({ subscription_credits_remaining: credits })
            .eq('id', profile.id)
        }
      }
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
