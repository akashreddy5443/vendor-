-- Fix categories table RLS policies
-- This allows all operations on categories table

-- First, enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow all operations on categories" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for all users" ON categories;
DROP POLICY IF EXISTS "Enable update for all users" ON categories;
DROP POLICY IF EXISTS "Enable delete for all users" ON categories;

-- Create permissive policies that allow all operations
CREATE POLICY "Allow all operations on categories"
ON categories
FOR ALL
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'categories';
