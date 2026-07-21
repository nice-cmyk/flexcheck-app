-- Adds a way to give credits back when a generation fails after they've
-- already been deducted. Before this, useGeneration() called consume_credits
-- up front (needed so we don't let a user start a generation they can't
-- afford), but if anything after that point failed - upload, compose,
-- video rendering, timeout, etc - the credits were gone with nothing to
-- show for them.
--
-- Refunds go entirely to pack_credits (which never expire) rather than
-- trying to reconstruct the exact subscription/pack split that
-- consume_credits used - simpler, and never worse for the user than the
-- original split.

create or replace function refund_credits(p_user_id uuid, p_amount numeric)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is distinct from p_user_id and auth.role() <> 'service_role' then
    raise exception 'not authorized';
  end if;

  update profiles
  set pack_credits = pack_credits + p_amount
  where id = p_user_id;

  insert into credit_transactions (user_id, amount, type, description)
  values (p_user_id, p_amount, 'generation_refund', 'Refund: generation failed after ' || p_amount || ' credit(s) were charged');
end;
$$;

revoke all on function refund_credits(uuid, numeric) from public;
grant execute on function refund_credits(uuid, numeric) to authenticated;
