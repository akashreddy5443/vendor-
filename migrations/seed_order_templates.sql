-- Order Confirmation Template
INSERT INTO public.notification_templates (template_key, subject, body_content, variables)
VALUES (
    'order_confirmation',
    'Order Confirmation: #{{order_id}}',
    '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ff4500;">Order Confirmed!</h1>
        <p>Hi {{user_name}},</p>
        <p>Thank you for your order. We are getting your gear ready.</p>
        <br/>
        {{order_details}}
        <br/>
        <p>You can track your order status in your <a href="{{site_url}}/user/orders" style="color: #ff4500;">User Dashboard</a>.</p>
        <p>Happy Coding,<br/>The TechDev Team</p>
    </div>',
    '["{{user_name}}", "{{order_id}}", "{{order_details}}", "{{site_url}}"]'
)
ON CONFLICT (template_key) DO NOTHING;

-- Order Shipped Template
INSERT INTO public.notification_templates (template_key, subject, body_content, variables)
VALUES (
    'order_shipped',
    'Your Order #{{order_id}} has Shipped! 🚚',
    '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ff4500;">On the Way!</h1>
        <p>Hi {{user_name}},</p>
        <p>Great news! Your gear has been dispatched and is making its way to you.</p>
        <br/>
        {{order_details}}
        <br/>
        <p>Track your shipment <a href="{{site_url}}/user/orders" style="color: #ff4500;">here</a>.</p>
        <p>The TechDev Team</p>
    </div>',
    '["{{user_name}}", "{{order_id}}", "{{order_details}}", "{{site_url}}"]'
)
ON CONFLICT (template_key) DO NOTHING;

-- Order Delivered Template
INSERT INTO public.notification_templates (template_key, subject, body_content, variables)
VALUES (
    'order_delivered',
    'Delivered: Order #{{order_id}} 📦',
    '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ff4500;">Delivered!</h1>
        <p>Hi {{user_name}},</p>
        <p>Your package has arrived. Time to upgrade your setup!</p>
        <br/>
        {{order_details}}
        <br/>
        <p>We hope you enjoy your new gear. Feel free to leave a review.</p>
        <p>Happy Coding,<br/>The TechDev Team</p>
    </div>',
    '["{{user_name}}", "{{order_id}}", "{{order_details}}", "{{site_url}}"]'
)
ON CONFLICT (template_key) DO NOTHING;
