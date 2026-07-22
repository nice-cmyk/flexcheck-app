-- Ajoute la possibilité d'acheter le tuto "Snap Rouge" à l'unité (9€), en plus
-- de l'accès déjà inclus pour les abonnés Flex/Pro (voir PLANS.snapTutorial
-- dans src/lib/stripe.ts). Le webhook Stripe met ce flag à true dès que
-- l'achat unique est confirmé (voir supabase/functions/stripe-webhook).

alter table profiles add column if not exists snap_tuto_purchased boolean default false;
