-- Migration 002: auto-create a profile with 1 free credit on signup
-- Run this in the Supabase SQL editor for your existing project.

create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, pack_credits)
  values (new.id, new.email, 1)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_handle_new_user on auth.users;

create trigger trg_handle_new_user
  after insert on auth.users
  for each row execute function handle_new_user();

-- Optional: grant 1 free credit to any existing user who has no profile yet
insert into public.profiles (id, email, pack_credits)
select u.id, u.email, 1
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
