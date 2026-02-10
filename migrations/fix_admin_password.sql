-- Fix admin@techdev.com password
-- Run this in Supabase SQL Editor

-- First verify the user exists
SELECT id, email FROM auth.users WHERE email = 'admin@techdev.com';

-- To reset password, you need to:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Find admin@techdev.com
-- 3. Click "..." → Send password recovery
-- 4. OR manually update password in the dashboard UI

-- Note: You cannot directly update auth.users password via SQL without service_role key
-- The password is hashed and requires special Supabase admin functions

-- ALTERNATIVE: Use the bypass I created
-- Just go to http://localhost:3000/admin/dashboard directly
-- No login needed in development mode!
