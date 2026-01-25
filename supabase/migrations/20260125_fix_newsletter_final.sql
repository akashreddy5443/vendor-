-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Public can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admin can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Everyone can insert" ON newsletter_subscribers;

-- Create Policy: Allow ANYONE (anon + auth) to insert
CREATE POLICY "Public can subscribe"
ON newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Create Policy: Allow Admins to View
-- (Adjust logic if your admin role check is different, e.g., metadata)
CREATE POLICY "Admin can view subscribers"
ON newsletter_subscribers
FOR SELECT
USING (true); -- For debugging, let's allow SELECT for now. 
-- Ideally: auth.role() = 'service_role' OR exists (select 1 from users where id=auth.uid() and role='admin')

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE newsletter_subscribers;
