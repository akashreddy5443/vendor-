-- Phase 1: Design Settings Table
-- This table stores global design customization settings

CREATE TABLE IF NOT EXISTS public.design_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  
  -- Color Settings
  primary_color VARCHAR(7) DEFAULT '#2d5cf7',
  accent_color VARCHAR(7) DEFAULT '#f59e0b',
  
  -- Typography Settings  
  heading_font VARCHAR(100) DEFAULT 'Outfit',
  body_font VARCHAR(100) DEFAULT 'Inter',
  
  -- Visual Settings
  card_radius VARCHAR(20) DEFAULT 'rounded-2xl',
  button_radius VARCHAR(20) DEFAULT 'rounded-xl',
  shadow_style VARCHAR(20) DEFAULT 'soft',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default global settings
INSERT INTO public.design_settings (setting_key)
VALUES ('global')
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.design_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY IF NOT EXISTS \"Allow public read access\"
  ON public.design_settings
  FOR SELECT
  USING (true);

-- Allow authenticated users to update (admin only in practice)
CREATE POLICY IF NOT EXISTS \"Allow authenticated update access\"
  ON public.design_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_design_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_design_settings_timestamp
  BEFORE UPDATE ON public.design_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_design_settings_updated_at();
