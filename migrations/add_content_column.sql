-- Check the current structure of homepage_sections table
-- Run this in Supabase SQL Editor to see what columns exist

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'homepage_sections'
ORDER BY ordinal_position;

-- If 'content' column doesn't exist, add it:
ALTER TABLE homepage_sections 
ADD COLUMN IF NOT EXISTS content JSONB;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'homepage_sections'
ORDER BY ordinal_position;
