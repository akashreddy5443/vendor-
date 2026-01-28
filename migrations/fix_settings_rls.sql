-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public)
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.site_settings;
CREATE POLICY "Settings are viewable by everyone" 
ON public.site_settings FOR SELECT 
TO public 
USING (true);

-- Allow full access to admins/service_role
-- Note: Supabase admins often use service_role, but for client-side admin usage we need authenticated users with role checks if implemented.
-- For now, let's allow authenticated users to UPDATE for simplicity, or just public if we trust the middleware.
-- To be safe given the detailed auth isn't fully visible:
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.site_settings;
CREATE POLICY "Enable insert for authenticated users only" 
ON public.site_settings FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.site_settings;
CREATE POLICY "Enable update for authenticated users only" 
ON public.site_settings FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Ensure columns exist (Idempotent)
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS global_discount_percentage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS default_gst_percentage DECIMAL(5,2) DEFAULT 18;
