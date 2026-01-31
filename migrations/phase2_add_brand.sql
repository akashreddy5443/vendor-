-- Add brand column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand text;

-- Seed brands based on common patterns in titles (Idempotent updates)
UPDATE products SET brand = 'Apple' WHERE title ILIKE '%MacBook%' OR title ILIKE '%iPhone%' OR title ILIKE '%iPad%';
UPDATE products SET brand = 'Samsung' WHERE title ILIKE '%Samsung%' OR title ILIKE '%Galaxy%';
UPDATE products SET brand = 'Sony' WHERE title ILIKE '%Sony%';
UPDATE products SET brand = 'Logitech' WHERE title ILIKE '%Logitech%' OR title ILIKE '%MX Master%';
UPDATE products SET brand = 'Razer' WHERE title ILIKE '%Razer%';
UPDATE products SET brand = 'Dell' WHERE title ILIKE '%Dell%' OR title ILIKE '%XPS%';
UPDATE products SET brand = 'TechDev' WHERE brand IS NULL; -- Default fallback
