-- Drop potentially conflicting or malformed policies
DROP POLICY IF EXISTS "Admins can do everything on coupons" ON public.coupons;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.coupons;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.coupons;

-- Re-enable RLS just in case
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create an explicit ALL policy for authenticated users
CREATE POLICY "Admins_Manage_Coupons"
ON public.coupons
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Optional: If testing without auth, un-comment below (but unsafe for prod)
-- CREATE POLICY "Allow_Public_Insert_Debug" ON public.coupons FOR INSERT TO anon WITH CHECK (true);
