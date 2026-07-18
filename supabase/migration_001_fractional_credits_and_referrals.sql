-- Migration à exécuter dans l'éditeur SQL Supabase de ton projet EXISTANT.
-- Elle adapte ta base déjà en ligne au nouveau système de crédits en fractions
-- (0,25 crédit/photo, 1,25-1,75 crédit/vidéo) et ajoute le programme d'affiliation.
-- Sans danger : ne supprime aucune donnée, convertit juste les colonnes int -> numeric.

alter table profiles
  alter column credits type numeric(6,2),
  alter column subscription_credits_remaining type numeric(6,2),
  alter column pack_credits type numeric(6,2);

alter table profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by uuid references auth.users(id);

alter table generations
  alter column credits_used type numeric(6,2),
  alter column credits_used set default 0.25;

alter table credit_transactions
  alter column amount type numeric(6,2);

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references auth.users(id) on delete cascade not null,
  referred_id uuid references auth.users(id) on delete cascade not null unique,
  referred_email text,
  status text default 'pending',
  reward_credits numeric(6,2) default 1,
  created_at timestamptz default now(),
  rewarded_at timestamptz
);

alter table referrals enable row level security;

drop policy if exists "Users see referrals they made" on referrals;
create policy "Users see referrals they made" on referrals for select using (referrer_id = auth.uid());

drop policy if exists "Users can insert their own referral row" on referrals;
create policy "Users can insert their own referral row" on referrals for insert with check (referred_id = auth.uid());

create or replace function generate_referral_code() returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..7 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$ language plpgsql;

create or replace function set_referral_code() returns trigger as $$
begin
  if new.referral_code is null then
    new.referral_code := generate_referral_code();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_referral_code on profiles;
create trigger trg_set_referral_code
  before insert on profiles
  for each row execute function set_referral_code();

-- Attribue un code de parrainage aux profils déjà existants qui n'en ont pas
update profiles set referral_code = generate_referral_code() where referral_code is null;
