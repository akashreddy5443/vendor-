-- Enable RLS on core tables if not already
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for Products
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public products are viewable by everyone'
    ) THEN
        CREATE POLICY "Public products are viewable by everyone" 
        ON public.products FOR SELECT 
        USING (true);
    END IF;
END $$;

-- Allow Public Read Access for Categories
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Public categories are viewable by everyone'
    ) THEN
        CREATE POLICY "Public categories are viewable by everyone" 
        ON public.categories FOR SELECT 
        USING (true);
    END IF;
END $$;

-- Allow Public Read Access for Product Images
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'product_images' AND policyname = 'Public product images are viewable by everyone'
    ) THEN
        CREATE POLICY "Public product images are viewable by everyone" 
        ON public.product_images FOR SELECT 
        USING (true);
    END IF;
END $$;
