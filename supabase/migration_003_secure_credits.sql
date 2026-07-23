-- Sécurise les crédits : un utilisateur connecté ne doit plus pouvoir modifier
-- directement ses propres crédits via le SDK Supabase côté navigateur.
-- Avant ce correctif, les policies "for all" autorisaient aussi UPDATE/DELETE,
-- ce qui permettait à n'importe qui de s'auto-créditer depuis la console du navigateur.

drop policy if exists "Users see own profile" on profiles;
create policy "Users can view own profile" on profiles
  for select using (id = auth.uid());

drop policy if exists "Users see own generations" on generations;
create policy "Users can view own generations" on generations
  for select using (user_id = auth.uid());
create policy "Users can insert own generations" on generations
  for insert with check (user_id = auth.uid());

drop policy if exists "Users see own transactions" on credit_transactions;
create policy "Users can view own transactions" on credit_transactions
  for select using (user_id = auth.uid());

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
