-- Create coupons table
create table if not exists coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric not null,
  min_order_amount numeric default 0,
  max_discount_amount numeric, -- useful for percentage caps
  start_date timestamptz default now(),
  end_date timestamptz,
  usage_limit integer,
  usage_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table coupons enable row level security;

-- Policies
-- Admins can do everything
create policy "Admins can manage coupons"
  on coupons for all
  using (
    auth.uid() in (select id from users where role = 'admin')
  );

-- Users can read active coupons (for validation)
-- In a real secure app, you might not expose the whole table, but use an RPC function to validate.
-- For now, we allow reading active coupons to check validity on client side or via server action.
create policy "Public can read active coupons"
  on coupons for select
  using (
    is_active = true 
    and (end_date is null or end_date > now())
    and (start_date is null or start_date <= now())
    and (usage_limit is null or usage_count < usage_limit)
  );

-- Add coupon_id to orders to track usage
alter table orders 
add column if not exists coupon_id uuid references coupons(id),
add column if not exists discount_amount numeric default 0;
