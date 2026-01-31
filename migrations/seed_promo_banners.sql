-- Seed 4 high-quality promo banners for the promo_grid section
-- First, ensure the section exists or update it if it does
INSERT INTO public.homepage_sections (section_type, content_json)
VALUES (
  'promo_grid',
  '{
    "cards": [
      {
        "id": "promo_1",
        "title": "FREE SHIPPING",
        "subtitle": "Global Tech Delivery",
        "description": "Complimentary worldwide shipping on all industrial units and professional equipment orders above ₹9,999.",
        "icon": "ShoppingBag",
        "href": "/products",
        "color": "bg-white border border-gray-100"
      },
      {
        "id": "promo_2",
        "title": "EXPERT SUPPORT",
        "subtitle": "24/7 Tech Assistance",
        "description": "Access our specialized technical team any time for installation guidance and product optimization support.",
        "icon": "Headphones",
        "href": "/contact",
        "color": "bg-blue-50/50 border border-blue-100"
      },
      {
        "id": "promo_3",
        "title": "SECURE PAYMENT",
        "subtitle": "SSL Encrypted Shop",
        "description": "Shop with absolute confidence. All transactions are protected with military-grade 256-bit SSL encryption.",
        "icon": "ShieldCheck",
        "href": "/about",
        "color": "bg-white border border-gray-100"
      },
      {
        "id": "promo_4",
        "title": "GENUINE GEAR",
        "subtitle": "100% Authentic Units",
        "description": "Every item in our hub is sourced directly from certified industrial manufacturers with full warranty support.",
        "icon": "Zap",
        "href": "/products",
        "color": "bg-yellow-50/50 border border-yellow-100"
      }
    ]
  }'::jsonb
)
ON CONFLICT (section_type) 
DO UPDATE SET 
  content_json = EXCLUDED.content_json,
  updated_at = NOW();
