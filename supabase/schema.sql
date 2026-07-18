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

create policy "Users see own profile" on profiles for all using (id = auth.uid());
create policy "Users see own generations" on generations for all using (user_id = auth.uid());
create policy "Users see own transactions" on credit_transactions for all using (user_id = auth.uid());
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
