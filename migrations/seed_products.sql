-- Seed Categories (Ensure they exist)
INSERT INTO public.categories (name, slug, description)
VALUES 
    ('Laptops', 'laptops', 'High-performance machines for coding and creative work.'),
    ('Phones', 'phones', 'Latest smartphones for testing and daily use.'),
    ('Audio', 'audio', 'Premium microphones and headphones.'),
    ('Accessories', 'accessories', 'Keyboards, mice, and more.')
ON CONFLICT (name) DO NOTHING;

-- Insert Products
DO $$
DECLARE
    cat_laptops uuid;
    cat_phones uuid;
    cat_audio uuid;
    cat_accessories uuid;
    p_id uuid;
BEGIN
    SELECT id INTO cat_laptops FROM public.categories WHERE name = 'Laptops';
    SELECT id INTO cat_phones FROM public.categories WHERE name = 'Phones';
    SELECT id INTO cat_audio FROM public.categories WHERE name = 'Audio';
    SELECT id INTO cat_accessories FROM public.categories WHERE name = 'Accessories';

    -- 1. MacBook Pro
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('ProDev MacBook Pro 16', 'prodev-macbook-pro-16', 'The ultimate machine for developers. M3 Max chip, 32GB RAM, 1TB SSD. Crushes compile times.', 249900, 50, 'active', cat_laptops)
    RETURNING id INTO p_id;
    
    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000', 'image', true);

    -- 2. Dell XPS 15
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('Dell XPS 15 Developer Edition', 'dell-xps-15', 'Premium Windows laptop with 4K OLED display and Ubuntu pre-installed. Perfect for Linux enthusiasts.', 185000, 30, 'active', cat_laptops)
    RETURNING id INTO p_id;

    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=1000', 'image', true);

    -- 3. Pixel 8 Pro
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('Pixel 8 Pro', 'pixel-8-pro', 'Google designed phone built for AI. Best in class camera and stock Android experience.', 105999, 100, 'active', cat_phones)
    RETURNING id INTO p_id;

    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1696446702305-64906bf38b16?auto=format&fit=crop&q=80&w=1000', 'image', true);

    -- 4. iPhone 15 Pro Max
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Titanium design, powerful A17 Pro chip, and USB-C. The standard for mobile development testing.', 159900, 100, 'active', cat_phones)
    RETURNING id INTO p_id;

    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000', 'image', true);

    -- 5. Shure SM7B
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('Shure SM7B Vocal Microphone', 'shure-sm7b', 'Legendary dynamic microphone for broadcasting, podcasting, and recording. Crystal clear audio.', 35000, 40, 'active', cat_audio)
    RETURNING id INTO p_id;

    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000', 'image', true);

    -- 6. HyperX QuadCast S
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('HyperX QuadCast S', 'hyperx-quadcast-s', 'USB condenser microphone with RGB lighting. Easy setup for streaming and meetings.', 15490, 60, 'active', cat_audio)
    RETURNING id INTO p_id;

    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1583597573809-5c4aa3e69f82?auto=format&fit=crop&q=80&w=1000', 'image', true);

    -- 7. Sony WH-1000XM5
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise canceling headphones. Focus on your code without distractions.', 29990, 80, 'active', cat_audio)
    RETURNING id INTO p_id;

    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000', 'image', true);

    -- 8. Keychron Q1 Pro
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('Keychron Q1 Pro Wireless', 'keychron-q1-pro', 'Custom mechanical keyboard with QMK/VIA support. Aluminum body and premium typing feel.', 19999, 45, 'active', cat_accessories)
    RETURNING id INTO p_id;

    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000', 'image', true);

    -- 9. MX Master 3S
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('Logitech MX Master 3S', 'mx-master-3s', 'The productivity mouse. Quiet clicks, fast scrolling, and ergonomic design.', 9995, 120, 'active', cat_accessories)
    RETURNING id INTO p_id;

    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&q=80&w=1000', 'image', true);

    -- 10. LG UltraGear Monitor
    INSERT INTO public.products (title, slug, description, price, stock, status, category_id)
    VALUES ('LG UltraGear 27" 4K', 'lg-ultragear-4k', '144Hz IPS panel with G-Sync. Crisp text and smooth motion for coding and gaming.', 45000, 25, 'active', cat_accessories)
    RETURNING id INTO p_id;

    INSERT INTO public.product_images (product_id, cloudinary_url, media_type, is_primary)
    VALUES (p_id, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000', 'image', true);

END $$;
