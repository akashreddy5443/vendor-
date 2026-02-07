-- Set default icons for all categories based on their names
-- Run this in Supabase SQL Editor

-- Electronics
UPDATE categories SET icon = 'Laptop' WHERE (LOWER(name) LIKE '%laptop%' OR LOWER(name) LIKE '%computer%' OR LOWER(name) LIKE '%macbook%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Smartphone' WHERE (LOWER(name) LIKE '%phone%' OR LOWER(name) LIKE '%mobile%' OR LOWER(name) LIKE '%iphone%' OR LOWER(name) LIKE '%pixel%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Tablet' WHERE (LOWER(name) LIKE '%tablet%' OR LOWER(name) LIKE '%ipad%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Monitor' WHERE (LOWER(name) LIKE '%monitor%' OR LOWER(name) LIKE '%display%' OR LOWER(name) LIKE '%screen%') AND (icon IS NULL OR icon = '');

-- Audio
UPDATE categories SET icon = 'Headphones' WHERE (LOWER(name) LIKE '%audio%' OR LOWER(name) LIKE '%headphone%' OR LOWER(name) LIKE '%earphone%' OR LOWER(name) LIKE '%earbuds%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Speaker' WHERE LOWER(name) LIKE '%speaker%' AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Mic' WHERE (LOWER(name) LIKE '%mic%' OR LOWER(name) LIKE '%microphone%') AND (icon IS NULL OR icon = '');

-- Accessories
UPDATE categories SET icon = 'Keyboard' WHERE LOWER(name) LIKE '%keyboard%' AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Mouse' WHERE (LOWER(name) LIKE '%mouse%' OR LOWER(name) LIKE '%mice%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Camera' WHERE (LOWER(name) LIKE '%camera%' OR LOWER(name) LIKE '%webcam%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Printer' WHERE LOWER(name) LIKE '%printer%' AND (icon IS NULL OR icon = '');

-- Gaming
UPDATE categories SET icon = 'Gamepad2' WHERE (LOWER(name) LIKE '%gaming%' OR LOWER(name) LIKE '%game%' OR LOWER(name) LIKE '%console%') AND (icon IS NULL OR icon = '');

-- Wearables
UPDATE categories SET icon = 'Watch' WHERE (LOWER(name) LIKE '%watch%' OR LOWER(name) LIKE '%wearable%') AND (icon IS NULL OR icon = '');

-- Storage & Connectivity
UPDATE categories SET icon = 'HardDrive' WHERE (LOWER(name) LIKE '%storage%' OR LOWER(name) LIKE '%drive%' OR LOWER(name) LIKE '%ssd%' OR LOWER(name) LIKE '%hdd%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Usb' WHERE (LOWER(name) LIKE '%usb%' OR LOWER(name) LIKE '%cable%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Router' WHERE (LOWER(name) LIKE '%router%' OR LOWER(name) LIKE '%network%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Wifi' WHERE LOWER(name) LIKE '%wifi%' AND (icon IS NULL OR icon = '');

-- Power
UPDATE categories SET icon = 'Battery' WHERE (LOWER(name) LIKE '%battery%' OR LOWER(name) LIKE '%charger%') AND (icon IS NULL OR icon = '');
UPDATE categories SET icon = 'Zap' WHERE LOWER(name) LIKE '%power%' AND (icon IS NULL OR icon = '');

-- Accessories & Misc
UPDATE categories SET icon = 'Package' WHERE (LOWER(name) LIKE '%accessories%' OR LOWER(name) LIKE '%accessory%' OR LOWER(name) LIKE '%misc%' OR LOWER(name) LIKE '%case%') AND (icon IS NULL OR icon = '');

-- Default fallback for any remaining categories without icons
UPDATE categories SET icon = 'ShoppingBag' WHERE icon IS NULL OR icon = '';

-- Show results
SELECT name, icon FROM categories ORDER BY name;

