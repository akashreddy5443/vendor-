-- Add price_presets column to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS price_presets JSONB DEFAULT '[
    {"label": "Under ₹20,000", "min": 0, "max": 20000},
    {"label": "₹20,000 - ₹50,000", "min": 20000, "max": 50000},
    {"label": "₹50,000 - ₹1,00,000", "min": 50000, "max": 100000},
    {"label": "Over ₹1,00,000", "min": 100000, "max": 1000000}
]'::jsonb;
