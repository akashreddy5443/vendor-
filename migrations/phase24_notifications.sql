-- Table for User Settings UI Toggles
CREATE TABLE IF NOT EXISTS public.notification_settings (
    key text PRIMARY KEY,
    label text NOT NULL,
    description text,
    is_active boolean DEFAULT true
);

-- Seed Default Toggles
INSERT INTO public.notification_settings (key, label, description, is_active)
VALUES 
    ('orders', 'Receive Order Updates (Email)', 'Get notified about order status, shipping, and delivery.', true),
    ('marketing', 'Receive Marketing Emails', 'Be the first to know about new drops and exclusive discounts.', true)
ON CONFLICT (key) DO NOTHING;

-- Table for Email Templates (CMS)
CREATE TABLE IF NOT EXISTS public.notification_templates (
    template_key text PRIMARY KEY,
    subject text NOT NULL,
    body_content text NOT NULL, -- Storing HTML content
    variables jsonb DEFAULT '[]'::jsonb -- List of available placeholders
);

-- Seed Default Templates
INSERT INTO public.notification_templates (template_key, subject, body_content, variables)
VALUES 
    ('welcome_email', 'Welcome to the Clan! 🚀', '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;"> <h1 style="color: #ff4500;">Welcome to the Clan!</h1> <p>Hey there,</p> <p>Thanks for subscribing to the <strong>TechDev Store</strong> newsletter.</p> <p>You are now on the list for exclusive drops, dev gear discounts, and setup inspiration.</p> <br/> <a href="{{site_url}}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Store</a> <br/><br/> <p>Happy Coding,<br/>The TechDev Team</p> </div>', '["{{site_url}}"]')
ON CONFLICT (template_key) DO NOTHING;

-- Enable RLS (Admin only management, Public read for settings)
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- Policies

-- Policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'notification_settings' AND policyname = 'Public read settings'
    ) THEN
        CREATE POLICY "Public read settings" ON public.notification_settings FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'notification_settings' AND policyname = 'Admins manage settings'
    ) THEN
        CREATE POLICY "Admins manage settings" ON public.notification_settings FOR ALL USING (auth.jwt() ->> 'email' IN ('akashreddy5443123@gmail.com', 'admin@techdev.com'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'notification_templates' AND policyname = 'Public read templates'
    ) THEN
        CREATE POLICY "Public read templates" ON public.notification_templates FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'notification_templates' AND policyname = 'Admins manage templates'
    ) THEN
        CREATE POLICY "Admins manage templates" ON public.notification_templates FOR ALL USING (auth.jwt() ->> 'email' IN ('akashreddy5443123@gmail.com', 'admin@techdev.com'));
    END IF;
END
$$;
