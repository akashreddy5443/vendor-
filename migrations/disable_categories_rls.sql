-- Check and disable RLS for categories table in development
-- This allows category updates without authentication

-- First, check current RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'categories';

-- Disable RLS on categories table (TEMPORARY - for development only!)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'categories';

-- NOTE: In production, you should enable RLS and create proper policies
-- For now, this allows updates to work in development mode
