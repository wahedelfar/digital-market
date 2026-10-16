-- Automatically provision a profile for email/password and OAuth users.
-- This avoids attempting an RLS-protected client insert before email confirmation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, store_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'store_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'متجري'
    )
  )
  on conflict (id) do update
    set email = excluded.email,
        store_name = coalesce(nullif(public.profiles.store_name, ''), excluded.store_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public, anon, authenticated;
