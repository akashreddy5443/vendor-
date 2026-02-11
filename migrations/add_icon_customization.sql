-- Add enhanced icon customization columns to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS icon_bg_color TEXT DEFAULT '#F3F4F6',
ADD COLUMN IF NOT EXISTS icon_color TEXT DEFAULT '#6B7280',
ADD COLUMN IF NOT EXISTS custom_icon_url TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'categories'
ORDER BY ordinal_position;
