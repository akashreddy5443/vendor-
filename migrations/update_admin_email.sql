-- Update admin email to your real email address
-- Run this in Supabase SQL Editor: https://reokmwqcdzofbimdwcxp.supabase.co/project/_/sql

-- Update the users table
UPDATE users 
SET email = 'akashreddy5443123@gmail.com'
WHERE email = 'admin@techdev.com';

-- Verify the update
SELECT id, email, role, name FROM users WHERE role = 'admin';
