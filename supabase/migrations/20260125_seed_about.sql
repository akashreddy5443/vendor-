-- 1. Create the About Us page if it doesn't exist
INSERT INTO public.pages (title, slug, content, is_published)
VALUES (
    'About Us',
    'about',
    '<h2>Welcome to TechDev Store</h2>
    <p>We are dedicated to providing the best tech products for developers and enthusiasts.</p>
    <p><strong>Creator:</strong> TechDeveloper</p>
    <p>Our mission is to empower creators with the tools they need to build the future.</p>',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Update the Footer config to include the About link
UPDATE public.homepage_sections
SET content_json = jsonb_set(
    COALESCE(content_json, '{}'::jsonb),
    '{infoLinks}',
    (
        COALESCE(content_json->'infoLinks', '[]'::jsonb) || 
        '[{"label": "About Us", "url": "/pages/about"}]'::jsonb
    )
)
WHERE section_type = 'footer'
AND NOT (content_json->'infoLinks' @> '[{"url": "/pages/about"}]');
