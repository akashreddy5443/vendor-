-- Add image_url column to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'categories'
ORDER BY ordinal_position;
