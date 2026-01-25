-- 1. Add full_name column
alter table public.users add column if not exists full_name text;

-- 2. Update the trigger function to capture full_name on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, role, full_name)
  values (
    new.id, 
    new.email, 
    'user', 
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 3. (Optional) Run this to backfill existing users if they have metadata
update public.users u
set full_name = (select raw_user_meta_data->>'full_name' from auth.users where id = u.id)
where full_name is null;
