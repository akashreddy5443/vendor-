-- 1. Create Wishlist Table if missing
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- 2. Enable RLS on Wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- 3. Add Wishlist Policies (Complete CRUD)
DO $$
BEGIN
    -- View own wishlist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own wishlist') THEN
        CREATE POLICY "Users can view own wishlist" ON public.wishlist
        FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Add to wishlist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can add to own wishlist') THEN
        CREATE POLICY "Users can add to own wishlist" ON public.wishlist
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Remove from wishlist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can remove from own wishlist') THEN
        CREATE POLICY "Users can remove from own wishlist" ON public.wishlist
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- 4. Ensure Categories has description column (Fix seed compatibility)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'description') THEN
        ALTER TABLE public.categories ADD COLUMN description TEXT DEFAULT '';
    END IF;
END $$;

-- 5. Fix RLS for Products/Categories (Public Read) - Idempotent
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public products view') THEN
        CREATE POLICY "Public products view" ON public.products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Public categories view') THEN
        CREATE POLICY "Public categories view" ON public.categories FOR SELECT USING (true);
    END IF;
END $$;
