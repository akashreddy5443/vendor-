ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon text;

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

INSERT INTO categories (id, name, slug, icon)
VALUES 
  (gen_random_uuid(), 'Laptops', 'laptops', '💻'),
  (gen_random_uuid(), 'Accessories', 'accessories', '🎧'),
  (gen_random_uuid(), 'Monitors', 'monitors', '🖥️'),
  (gen_random_uuid(), 'Keyboards', 'keyboards', '⌨️'),
  (gen_random_uuid(), 'Mice', 'mice', '🖱️'),
  (gen_random_uuid(), 'Smartphones', 'smartphones', '📱')
ON CONFLICT (slug) DO UPDATE 
SET icon = EXCLUDED.icon;
