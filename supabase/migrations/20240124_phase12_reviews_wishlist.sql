-- Wishlist Table
create table if not exists wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Reviews Table
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table wishlist enable row level security;
alter table reviews enable row level security;

-- Policies for Wishlist
create policy "Users can view their own wishlist"
  on wishlist for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own wishlist"
  on wishlist for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from their own wishlist"
  on wishlist for delete
  using (auth.uid() = user_id);

-- Policies for Reviews
create policy "Public can view reviews"
  on reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on reviews for delete
  using (auth.uid() = user_id);
