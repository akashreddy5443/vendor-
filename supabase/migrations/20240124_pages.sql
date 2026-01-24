create table if not exists pages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table pages enable row level security;

-- Policies
create policy "Public can view published pages"
  on pages for select
  using (is_published = true);

create policy "Admin can do everything on pages"
  on pages for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
