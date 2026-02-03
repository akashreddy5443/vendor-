-- Add Tax Configuration Columns
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS tax_label text DEFAULT 'GST',
ADD COLUMN IF NOT EXISTS tax_breakdown_enabled boolean DEFAULT true;
