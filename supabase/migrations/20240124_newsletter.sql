create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table newsletter_subscribers enable row level security;

-- Policies
create policy "Public can subscribe"
  on newsletter_subscribers for insert
  with check (true);

create policy "Admin can view subscribers"
  on newsletter_subscribers for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
