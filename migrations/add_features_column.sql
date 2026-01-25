-- Add 'features' JSONB column to products table for storing Key-Value specifications
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- Example structure: [{"key": "Processor", "value": "M3 Max"}, {"key": "RAM", "value": "32GB"}]
