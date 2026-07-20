// Crée automatiquement les 6 produits/prix Stripe de FlexCheck (3 abonnements + 3 packs)
// et met à jour .env.local avec les vrais Price ID.
//
// Usage : node scripts/setup-stripe.mjs
// Nécessite STRIPE_SECRET_KEY déjà renseigné dans .env.local (clé de test ou clé restreinte
// avec permission "Checkout Sessions: Write" + "Products: Write" + "Prices: Write").
//
// Le script est idempotent : si un produit du même nom existe déjà, il réutilise son prix
// au lieu d'en recréer un.

import fs from 'node:fs'
import path from 'node:path'
import Stripe from 'stripe'

const envPath = path.resolve(process.cwd(), '.env.local')

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local introuvable. Copie .env.example en .env.local d\'abord.')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf-8')
const envMap = Object.fromEntries(
  envContent
    .split('\n')
    .map((line) => line.match(/^([A-Z0-9_]+)=(.*)$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]])
)

const secretKey = envMap.STRIPE_SECRET_KEY
if (!secretKey || secretKey.includes('YOUR_')) {
  console.error('❌ STRIPE_SECRET_KEY manquant ou non renseigné dans .env.local.')
  process.exit(1)
}

const stripe = new Stripe(secretKey)

// Montants alignés avec src/lib/stripe.ts (PLANS). Ne pas les faire diverger :
// c'est ce script (ou une modif manuelle des Price Stripe) qui définit le
// montant RÉELLEMENT facturé - la valeur affichée dans PLANS n'est qu'un
// libellé côté front. Si tu changes un prix dans PLANS, relance ce script
// (il crée un nouveau Price, l'ancien reste actif tant que non archivé) et
// mets à jour la variable d'env correspondante sur Vercel.
const ITEMS = [
  { key: 'PRICE_STARTER', name: 'FlexCheck Starter', amount: 1399, recurring: true },
  { key: 'PRICE_FLEX', name: 'FlexCheck Flex', amount: 2299, recurring: true },
  { key: 'PRICE_PRO', name: 'FlexCheck Pro', amount: 3999, recurring: true },
  { key: 'PRICE_PACK5', name: 'FlexCheck Pack 5 crédits', amount: 799, recurring: false },
  { key: 'PRICE_PACK15', name: 'FlexCheck Pack 15 crédits', amount: 1799, recurring: false },
  { key: 'PRICE_PACK40', name: 'FlexCheck Pack 40 crédits', amount: 3999, recurring: false },
]

async function findExistingPrice(name) {
  const products = await stripe.products.list({ limit: 100 })
  const existing = products.data.find((p) => p.name === name)
  if (!existing) return null
  const prices = await stripe.prices.list({ product: existing.id, limit: 1, active: true })
  return prices.data[0]?.id ?? null
}

async function main() {
  console.log(`Mode : ${secretKey.startsWith('rk_live') || secretKey.startsWith('sk_live') ? '🔴 LIVE (argent réel)' : '🟢 TEST'}\n`)

  const results = {}

  for (const item of ITEMS) {
    const already = await findExistingPrice(item.name)
    if (already) {
      console.log(`↺ ${item.name} existe déjà → ${already}`)
      results[item.key] = already
      continue
    }

    const product = await stripe.products.create({ name: item.name })
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: item.amount,
      currency: 'usd',
      ...(item.recurring ? { recurring: { interval: 'month' } } : {}),
    })

    console.log(`✓ ${item.name} créé → ${price.id}`)
    results[item.key] = price.id
  }

  let updated = envContent
  for (const [key, priceId] of Object.entries(results)) {
    const re = new RegExp(`^${key}=.*$`, 'm')
    updated = updated.match(re) ? updated.replace(re, `${key}=${priceId}`) : `${updated}\n${key}=${priceId}`
  }
  fs.writeFileSync(envPath, updated)

  console.log('\n.env.local mis à jour avec les vrais Price ID. ✅')
}

main().catch((err) => {
  console.error('❌ Erreur Stripe :', err.message)
  process.exit(1)
})
