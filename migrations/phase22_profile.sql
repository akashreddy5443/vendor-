-- Add Profile Fields to Users Table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"marketing": false, "orders": true}'::jsonb;

-- Policy to allow users to update their own profile (if not exists)
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);
