# FlexCheck

App web pour générer des photos et vidéos IA de style lifestyle de luxe.
Interface entièrement en français, thème sombre premium (voir `flexcheck_context_v2.md`).

## Stack

- React + Vite + TypeScript, Tailwind CSS
- Supabase (Auth + Database + Storage)
- Stripe (abonnements + packs de crédits)
- OpenAI GPT-4o (recherche web de références + édition d'image)
- fal.ai Kling 2.5 Pro (image-to-vidéo)

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseigner tes clés
npm run dev
```

## Base de données

Exécute `supabase/schema.sql` dans l'éditeur SQL de ton projet Supabase
(crée les tables `profiles`, `generations`, `credit_transactions` + RLS).

## Paiements

1. Crée les produits/prix Stripe pour les 3 abonnements et les 3 packs de crédits.
2. Mets en place un endpoint backend `/api/create-checkout-session` (ou une Supabase
   Edge Function) qui crée la session Stripe Checkout côté serveur — la clé secrète
   Stripe ne doit jamais être exposée côté client.
3. Déploie `supabase/functions/stripe-webhook` et configure l'URL du webhook dans
   le dashboard Stripe (événements : `checkout.session.completed`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.payment_succeeded`).

## Génération IA

`src/lib/openai.ts` et `src/lib/fal.ts` contiennent les appels API (recherche de
références, édition d'image, génération vidéo). Les appels directs au client sont
prévus pour le prototypage — en production, ces appels doivent passer par un
backend/edge function pour ne pas exposer les clés API (`OPENAI_API_KEY`,
`VITE_FAL_API_KEY`) côté navigateur.

## Ce qui n'est pas encore construit (volontairement, cf. contexte)

Pas d'app mobile, pas de fil social, pas de partage entre utilisateurs, pas de
panneau admin, pas de programme de parrainage, pas de watermark.
