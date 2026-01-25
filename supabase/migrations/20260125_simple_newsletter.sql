-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Security (RLS)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 3. Allow Public Insert (Everyone can subscribe)
CREATE POLICY "Enable insert for all" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- 4. Allow Admin Select (So you can see the list)
CREATE POLICY "Enable read for all" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (true);
