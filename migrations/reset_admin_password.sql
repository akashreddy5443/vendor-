-- Reset admin password in Supabase
-- Run this in Supabase SQL Editor

-- Option 1: Update existing admin user password
-- This sets password to: admin123456
-- Change the password hash below if you want a different password

-- First, let's check if the admin user exists
SELECT id, email, role FROM users WHERE email = 'akashreddy5443123@gmail.com';

-- If user exists, you need to reset password via Supabase Dashboard:
-- 1. Go to: https://reokmwqcdzofbimdwcxp.supabase.co/project/_/auth/users
-- 2. Find user: akashreddy5443123@gmail.com
-- 3. Click the "..." menu on the right
-- 4. Select "Reset Password"
-- 5. Set new password: admin123456 (or your choice)

-- OR use this SQL to send password reset email:
-- This requires you to have email configured in Supabase
-- The user will receive an email with a reset link

-- Note: Direct password updates require service_role key which we don't have in client-side code
-- The safest way is through Supabase Dashboard as described above
