-- Add min_price_filter and max_price_filter columns to site_settings table
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS min_price_filter DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS max_price_filter DECIMAL(10, 2) DEFAULT 100000.00;

-- Update existing record (if any) to have defaults
UPDATE site_settings 
SET min_price_filter = 0.00, 
    max_price_filter = 100000.00 
WHERE id = 1;
