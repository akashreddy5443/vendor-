-- Add Student Fields to users table
alter table "users" 
add column if not exists "is_student" boolean default false,
add column if not exists "university_name" text,
add column if not exists "university_id" text;

-- Create Addresses Table
create table if not exists "addresses" (
  "id" uuid default gen_random_uuid() primary key,
  "user_id" uuid references auth.users(id) on delete cascade not null,
  "full_name" text not null,
  "street_address" text not null,
  "city" text not null,
  "state" text,
  "postal_code" text not null,
  "country" text not null default 'India',
  "is_default" boolean default false,
  "created_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Addresses
alter table "addresses" enable row level security;

create policy "Users can view their own addresses"
  on "addresses" for select
  using (auth.uid() = user_id);

create policy "Users can insert their own addresses"
  on "addresses" for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own addresses"
  on "addresses" for update
  using (auth.uid() = user_id);

create policy "Users can delete their own addresses"
  on "addresses" for delete
  using (auth.uid() = user_id);
