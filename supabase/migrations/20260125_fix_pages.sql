-- 1. Create the Pages table
create table if not exists public.pages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.pages enable row level security;

-- 3. Create Policies (Fixed to use public.users instead of profiles)
drop policy if exists "Public can view published pages" on public.pages;
create policy "Public can view published pages"
  on public.pages for select
  using (is_published = true);

drop policy if exists "Admin can do everything on pages" on public.pages;
create policy "Admin can do everything on pages"
  on public.pages for all
  using (
    exists (
      select 1 from public.users
      where public.users.id = auth.uid()
      and public.users.role = 'admin'
    )
  );

-- 4. Seed the About Us page
INSERT INTO public.pages (title, slug, content, is_published)
VALUES (
    'About Us',
    'about',
    '<h2>Welcome to TechDev Store</h2>
    <p>We are dedicated to providing the best tech products for developers and enthusiasts.</p>
    <p><strong>Creator:</strong> TechDeveloper</p>
    <p>Our mission is to empower creators with the tools they need to build the future.</p>',
    true
)
ON CONFLICT (slug) DO UPDATE 
SET content = EXCLUDED.content;

-- 5. Update the Footer config to include the About link
UPDATE public.homepage_sections
SET content_json = jsonb_set(
    COALESCE(content_json, '{}'::jsonb),
    '{infoLinks}',
    (
        COALESCE(content_json->'infoLinks', '[]'::jsonb) || 
        '[{"label": "About Us", "url": "/pages/about"}]'::jsonb
    )
)
WHERE section_type = 'footer'
AND NOT (content_json->'infoLinks' @> '[{"url": "/pages/about"}]');
