-- 1. Add the missing 'icon' column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'icon') THEN
        ALTER TABLE categories ADD COLUMN icon text;
    END IF;
END $$;

-- 2. Create partial search function (safe to run even if exists)
CREATE OR REPLACE FUNCTION get_order_by_partial_id(lookup_id text)
RETURNS SETOF orders
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM orders
  WHERE id::text ILIKE lookup_id || '%';
END;
$$;

-- 3. Seed categories properly now that the column exists
INSERT INTO categories (id, name, slug, icon)
VALUES 
  (gen_random_uuid(), 'Laptops', 'laptops', '💻'),
  (gen_random_uuid(), 'Accessories', 'accessories', '🎧'),
  (gen_random_uuid(), 'Monitors', 'monitors', '🖥️'),
  (gen_random_uuid(), 'Keyboards', 'keyboards', '⌨️'),
  (gen_random_uuid(), 'Mice', 'mice', '🖱️'),
  (gen_random_uuid(), 'Headphones', 'headphones', '🎧'),
  (gen_random_uuid(), 'Smartphones', 'smartphones', '📱'),
  (gen_random_uuid(), 'Tablets', 'tablets', '📟')
ON CONFLICT (slug) DO UPDATE 
SET icon = EXCLUDED.icon;
