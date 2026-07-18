-- FlexCheck — schéma Supabase

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  credits numeric(6,2) default 0,
  subscription_status text default 'inactive', -- inactive | active | cancelled
  subscription_plan text, -- starter | flex | pro
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_credits_remaining numeric(6,2) default 0,
  pack_credits numeric(6,2) default 0, -- n'expirent jamais
  referral_code text unique,
  referred_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null, -- 'photo' | 'video'
  user_prompt text not null,
  reference_image_urls text[],
  composite_image_url text,
  final_url text,
  fal_request_id text,
  status text default 'pending', -- pending | generating | complete | failed
  credits_used numeric(6,2) default 0.25,
  created_at timestamptz default now(),
  expires_at timestamptz default now() + interval '24 hours'
);

create table credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  amount numeric(6,2) not null, -- positif = ajouté, négatif = utilisé
  type text not null, -- 'subscription' | 'pack_purchase' | 'generation_use' | 'referral_reward'
  stripe_payment_intent_id text,
  description text,
  created_at timestamptz default now()
);

create table referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references auth.users(id) on delete cascade not null,
  referred_id uuid references auth.users(id) on delete cascade not null unique,
  referred_email text,
  status text default 'pending', -- pending | rewarded
  reward_credits numeric(6,2) default 1,
  created_at timestamptz default now(),
  rewarded_at timestamptz
);

alter table profiles enable row level security;
alter table generations enable row level security;
alter table credit_transactions enable row level security;
alter table referrals enable row level security;

-- Lecture seule pour les utilisateurs sur leurs propres lignes : les crédits ne
-- doivent JAMAIS être modifiables directement depuis le navigateur (voir
-- consume_credits() plus bas, qui est la seule voie d'écriture autorisée).
create policy "Users can view own profile" on profiles for select using (id = auth.uid());
create policy "Users can view own generations" on generations for select using (user_id = auth.uid());
create policy "Users can insert own generations" on generations for insert with check (user_id = auth.uid());
create policy "Users can view own transactions" on credit_transactions for select using (user_id = auth.uid());
create policy "Users see referrals they made" on referrals for select using (referrer_id = auth.uid());
create policy "Users can insert their own referral row" on referrals for insert with check (referred_id = auth.uid());

-- Génère un code de parrainage court et unique à la création du profil
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

create trigger trg_set_referral_code
  before insert on profiles
  for each row execute function set_referral_code();

-- Crée automatiquement un profil (avec 1 crédit gratuit) à chaque inscription
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, pack_credits)
  values (new.id, new.email, 1)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function handle_new_user();

-- Consomme des crédits de façon atomique et sécurisée : c'est la SEULE voie
-- d'écriture sur les crédits d'un utilisateur (les policies RLS n'autorisent
-- que la lecture directe, voir plus haut).
create or replace function consume_credits(p_user_id uuid, p_amount numeric)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub numeric;
  v_pack numeric;
  v_sub_use numeric;
  v_pack_use numeric;
begin
  if auth.uid() is distinct from p_user_id and auth.role() <> 'service_role' then
    raise exception 'not authorized';
  end if;

  select subscription_credits_remaining, pack_credits
    into v_sub, v_pack
  from profiles
  where id = p_user_id
  for update;

  if v_sub is null then
    return false;
  end if;

  if (v_sub + v_pack) < p_amount then
    return false;
  end if;

  v_sub_use := least(v_sub, p_amount);
  v_pack_use := p_amount - v_sub_use;

  update profiles
  set subscription_credits_remaining = subscription_credits_remaining - v_sub_use,
      pack_credits = pack_credits - v_pack_use
  where id = p_user_id;

  insert into credit_transactions (user_id, amount, type, description)
  values (p_user_id, -p_amount, 'generation_use', 'Used ' || p_amount || ' credit(s)');

  return true;
end;
$$;

revoke all on function consume_credits(uuid, numeric) from public;
grant execute on function consume_credits(uuid, numeric) to authenticated;
