
-- 1. Enable RLS to be safe (so we control everything explicitly)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Drop ANY and ALL potential existing read policies to avoid conflicts
DROP POLICY IF EXISTS "Public Read Access" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Anyone can read products" ON products;

-- 3. Create a single, clear policy for SELECT
-- This allows ANYONE to read rows where logic is true. 
-- We use 'true' to allow reading ALL products (filtering active/draft happens in the query usually, but 'true' is safest for permission)
CREATE POLICY "Public Read Access of Products" 
ON products FOR SELECT 
USING (true);

-- 4. Explicitly GRANT permissions to all relevant roles
-- 'anon' = guests (not logged in)
-- 'authenticated' = logged in users
-- 'service_role' = admin/backend (usually has bypass anyway, but good to be explicit)
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;
GRANT SELECT ON products TO service_role;

-- 5. Just in case, ensure the sequence/schema permissions are right
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
