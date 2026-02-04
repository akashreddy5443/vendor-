
-- Enable RLS on products (good practice, ensuring we don't accidentally expose future restricted columns)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it conflicts (to be safe)
DROP POLICY IF EXISTS "Public Read Access" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;

-- Create the policy allowing EVERYONE (anon and authenticated) to SELECT
CREATE POLICY "Enable read access for all users" 
ON products FOR SELECT 
USING (true);

-- Grant usage just in case
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;
GRANT SELECT ON products TO service_role;
