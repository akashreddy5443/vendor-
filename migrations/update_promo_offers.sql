-- Update the promo_grid section with 4 premium Limited Edition offers with DISCOUNTS
UPDATE homepage_sections
SET content_json = '{
  "cards": [
    {
      "id": "promo-1",
      "title": "Launch Offer",
      "subtitle": "Flat 15% OFF",
      "description": "On the new Quantum X1 Flagship. Limited units.",
      "icon": "Zap",
      "href": "/products?category=laptops",
      "delay": 0.1,
      "color": "bg-slate-50 border-slate-100"
    },
    {
      "id": "promo-2",
      "title": "Studio Deal",
      "subtitle": "Save ₹5,000",
      "description": "Pro-grade noise cancellation. Ends tonight.",
      "icon": "Headphones",
      "href": "/products?category=audio",
      "delay": 0.2,
      "color": "bg-white border-slate-100"
    },
    {
      "id": "promo-3",
      "title": "Bundle Save",
      "subtitle": "Get 20% OFF",
      "description": "When you buy EcoHub with any sensor.",
      "icon": "ShieldCheck",
      "href": "/products?category=accessories",
      "delay": 0.3,
      "color": "bg-white border-slate-100"
    },
    {
      "id": "promo-4",
      "title": "Early Bird",
      "subtitle": "Free Shipping",
      "description": "Pre-order Vision AR today. No hidden fees.",
      "icon": "Camera",
      "href": "/products?category=monitors",
      "delay": 0.4,
      "color": "bg-slate-50 border-slate-100"
    }
  ]
}'
WHERE section_type = 'promo_grid';

-- Safety Insert if missing
INSERT INTO homepage_sections (section_type, content_json, is_active, display_order)
SELECT 'promo_grid', '{
  "cards": [
    {
      "id": "promo-1",
      "title": "Launch Offer",
      "subtitle": "Flat 15% OFF",
      "description": "On the new Quantum X1 Flagship. Limited units.",
      "icon": "Zap",
      "href": "/products?category=laptops",
      "delay": 0.1,
      "color": "bg-slate-50 border-slate-100"
    },
    {
      "id": "promo-2",
      "title": "Studio Deal",
      "subtitle": "Save ₹5,000",
      "description": "Pro-grade noise cancellation. Ends tonight.",
      "icon": "Headphones",
      "href": "/products?category=audio",
      "delay": 0.2,
      "color": "bg-white border-slate-100"
    },
    {
      "id": "promo-3",
      "title": "Bundle Save",
      "subtitle": "Get 20% OFF",
      "description": "When you buy EcoHub with any sensor.",
      "icon": "ShieldCheck",
      "href": "/products?category=accessories",
      "delay": 0.3,
      "color": "bg-white border-slate-100"
    },
    {
      "id": "promo-4",
      "title": "Early Bird",
      "subtitle": "Free Shipping",
      "description": "Pre-order Vision AR today. No hidden fees.",
      "icon": "Camera",
      "href": "/products?category=monitors",
      "delay": 0.4,
      "color": "bg-slate-50 border-slate-100"
    }
  ]
}', true, 3
WHERE NOT EXISTS (SELECT 1 FROM homepage_sections WHERE section_type = 'promo_grid');
