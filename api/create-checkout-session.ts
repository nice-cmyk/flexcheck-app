// Vercel Serverless Function — crée une session Stripe Checkout côté serveur.
// Déploiement : ce fichier est déployé automatiquement par Vercel sous
// /api/create-checkout-session (aucune config supplémentaire nécessaire).
//
// Variables d'environnement requises côté Vercel (Project Settings > Environment
// Variables) :
//   STRIPE_SECRET_KEY
//   PRICE_STARTER, PRICE_FLEX, PRICE_PRO           (Price IDs Stripe des abonnements)
//   PRICE_PACK5, PRICE_PACK15, PRICE_PACK40        (Price IDs Stripe des packs)
//   PRICE_SNAP_TUTO                                 (Price ID Stripe du tuto Snap Rouge, achat unique 9€)
//   PUBLIC_APP_URL                                  (ex: https://flexcheck.ai)

import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const PLAN_PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.PRICE_STARTER,
  flex: process.env.PRICE_FLEX,
  pro: process.env.PRICE_PRO,
}

const PACK_PRICE_IDS: Record<string, string | undefined> = {
  pack5: process.env.PRICE_PACK5,
  pack15: process.env.PRICE_PACK15,
  pack40: process.env.PRICE_PACK40,
}

const ITEM_PRICE_IDS: Record<string, string | undefined> = {
  snap_tuto: process.env.PRICE_SNAP_TUTO,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  try {
    const { mode, planId, packId, itemId, userId } = req.body as {
      mode: 'subscription' | 'payment'
      planId?: string
      packId?: string
      itemId?: string
      userId: string
    }

    if (!userId) {
      return res.status(400).json({ error: 'userId manquant' })
    }

    const appUrl = process.env.PUBLIC_APP_URL ?? 'http://localhost:5173'

    let priceId: string | undefined
    let metadata: Record<string, string> = { userId }

    if (mode === 'subscription') {
      if (!planId || !PLAN_PRICE_IDS[planId]) {
        return res.status(400).json({ error: 'Plan invalide' })
      }
      priceId = PLAN_PRICE_IDS[planId]
      metadata = { ...metadata, planId }
    } else if (mode === 'payment' && itemId) {
      if (!ITEM_PRICE_IDS[itemId]) {
        return res.status(400).json({ error: 'Item invalide' })
      }
      priceId = ITEM_PRICE_IDS[itemId]
      metadata = { ...metadata, itemId }
    } else if (mode === 'payment') {
      if (!packId || !PACK_PRICE_IDS[packId]) {
        return res.status(400).json({ error: 'Pack invalide' })
      }
      priceId = PACK_PRICE_IDS[packId]
      metadata = { ...metadata, packId }
    } else {
      return res.status(400).json({ error: 'mode invalide (subscription | payment)' })
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      client_reference_id: userId,
      metadata,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: itemId
        ? `${appUrl}/app/snap-tuto?checkout=success`
        : `${appUrl}/app/credits?checkout=success`,
      cancel_url: itemId
        ? `${appUrl}/app/snap-tuto?checkout=cancelled`
        : `${appUrl}/app/credits?checkout=cancelled`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err: any) {
    console.error('create-checkout-session error', err)
    return res.status(500).json({ error: err.message ?? 'Erreur serveur' })
  }
}
