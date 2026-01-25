-- Force Public Access for Products
DROP POLICY IF EXISTS "Public products view" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "products_read_policy" ON public.products; 
-- (Drop any common variations)

CREATE POLICY "Public products view" ON public.products
FOR SELECT USING (true);

-- Force Public Access for Categories
DROP POLICY IF EXISTS "Public categories view" ON public.categories;
CREATE POLICY "Public categories view" ON public.categories
FOR SELECT USING (true);

-- Force Public Access for Product Images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public product_images view" ON public.product_images;
CREATE POLICY "Public product_images view" ON public.product_images
FOR SELECT USING (true);

-- Force Public Access for Homepage Sections/Config (if applicable, ensuring homepage works)
-- (Assuming homepage_sections table)
