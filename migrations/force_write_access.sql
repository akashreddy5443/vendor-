-- Force Write Access for Authenticated Users (Admins)
-- This fixes "Create Product" and "Edit Product" failure

-- 1. PRODUCTS TABLE
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable write access for authenticated users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.products;

CREATE POLICY "Enable write access for authenticated users" ON public.products
FOR ALL -- Insert, Update, Delete, Select
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. PRODUCT_IMAGES TABLE
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable write access for authenticated users" ON public.product_images;

CREATE POLICY "Enable write access for authenticated users" ON public.product_images
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. CATEGORIES TABLE (If you need to create categories)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON public.categories;
CREATE POLICY "Enable write access for authenticated users" ON public.categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
