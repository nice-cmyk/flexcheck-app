-- Ajoute un mode "crédits illimités" pour des comptes VIP/internes (ex :
-- garyhamza107@gmail.com), qui ne doivent jamais être bloqués ni décomptés.

-- 1) Nouvelle colonne sur profiles.
alter table profiles add column if not exists unlimited_credits boolean default false;

-- 2) consume_credits() bypass complet quand unlimited_credits = true : aucune
--    déduction, jamais de "not enough credits".
create or replace function consume_credits(p_user_id uuid, p_amount numeric)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub numeric;
  v_pack numeric;
  v_unlimited boolean;
  v_sub_use numeric;
  v_pack_use numeric;
begin
  if auth.uid() is distinct from p_user_id and auth.role() <> 'service_role' then
    raise exception 'not authorized';
  end if;

  select subscription_credits_remaining, pack_credits, coalesce(unlimited_credits, false)
    into v_sub, v_pack, v_unlimited
  from profiles
  where id = p_user_id
  for update;

  if v_sub is null then
    return false;
  end if;

  if v_unlimited then
    insert into credit_transactions (user_id, amount, type, description)
    values (p_user_id, 0, 'generation_use', 'Used ' || p_amount || ' credit(s) (unlimited account)');
    return true;
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

-- 3) Active le flag pour ce compte précis. Ne marche que si le compte a déjà
--    été créé (l'utilisateur doit s'être déjà inscrit sur Flexcheck) — sinon
--    relance juste cette ligne une fois qu'il l'a fait.
update profiles set unlimited_credits = true where email = 'garyhamza107@gmail.com';
