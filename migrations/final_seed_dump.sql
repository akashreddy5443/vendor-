-- Disable RLS temporarily (Supabase specific)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;

-- Clean up
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;

-- 1. Categories
INSERT INTO categories (name, slug) VALUES
('Laptops', 'laptops'),
('Phones', 'phones'),
('Audio', 'audio'),
('Accessories', 'accessories');

-- 2. Products (Using subqueries for category_id to ensure validity)
-- Laptops
INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'ProDev MacBook Pro 16', 'macbook-pro-16', 'M3 Max chip, 32GB RAM.', 249900, 50, 'active', id FROM categories WHERE slug = 'laptops';

INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'Dell XPS 15', 'dell-xps-15', '4K OLED, Ubuntu.', 185000, 30, 'active', id FROM categories WHERE slug = 'laptops';

-- Phones
INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'Pixel 8 Pro', 'pixel-8-pro', 'Google AI Phone.', 105999, 100, 'active', id FROM categories WHERE slug = 'phones';

INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'iPhone 15 Pro Max', 'iphone-15-pro', 'Titanium.', 159900, 100, 'active', id FROM categories WHERE slug = 'phones';

-- Audio
INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'Shure SM7B', 'shure-sm7b', 'Vocal Mic.', 35000, 40, 'active', id FROM categories WHERE slug = 'audio';

INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'Sony WH-1000XM5', 'sony-xm5', 'Noise Canceling.', 29990, 80, 'active', id FROM categories WHERE slug = 'audio';

-- Accessories
INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'Keychron Q1 Pro', 'keychron-q1', 'Mechanical Keyboard.', 19999, 45, 'active', id FROM categories WHERE slug = 'accessories';

INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'Logitech MX Master 3S', 'mx-master-3s', 'Productivity Mouse.', 9995, 120, 'active', id FROM categories WHERE slug = 'accessories';

INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'LG UltraGear 4K', 'lg-ultragear', 'Gaming Monitor.', 45000, 25, 'active', id FROM categories WHERE slug = 'accessories';

INSERT INTO products (title, slug, description, price, stock, status, category_id)
SELECT 'Logitech Webcam', 'webcam', '4K Webcam.', 15000, 50, 'active', id FROM categories WHERE slug = 'accessories';


-- 3. Product Images (Linking via slug)
INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'macbook-pro-16';

INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'dell-xps-15';

INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1696446702305-64906bf38b16?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'pixel-8-pro';

INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'iphone-15-pro';

INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'shure-sm7b';

INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'sony-xm5';

INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'keychron-q1';

INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'mx-master-3s';

INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'lg-ultragear';

INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&q=80&w=1000', 'image', true FROM products WHERE slug = 'webcam';

-- 4. Featured Section (Grab first 3)
WITH three_products AS (
    SELECT id FROM products LIMIT 3
)
INSERT INTO homepage_sections (section_type, title, subtitle, content_json, is_active)
VALUES (
    'featured', 
    'Featured Gear', 
    'Top picks.', 
    json_build_object('productIds', (SELECT json_agg(id) FROM three_products)), 
    true
)
ON CONFLICT (section_type) 
DO UPDATE SET 
    content_json = json_build_object('productIds', (SELECT json_agg(id) FROM three_products)),
    is_active = true;

-- Re-enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Add Permissions (Idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public products view') THEN
        CREATE POLICY "Public products view" ON products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public categories view') THEN
        CREATE POLICY "Public categories view" ON categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public images view') THEN
        CREATE POLICY "Public images view" ON product_images FOR SELECT USING (true);
    END IF;
END $$;
