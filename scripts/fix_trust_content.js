const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_CONTENT = {
    title: "Why Customers Trust TechDev",
    subtitle: "We are committed to providing the best shopping experience.",
    features: [
        {
            name: "Authorized Hub",
            description: "Official dealer for all featured brands. 100% genuine guarantees.",
            icon: "ShieldCheck"
        },
        {
            name: "Express Delivery",
            description: "Same-day shipping for orders before 2PM. Global tracking included.",
            icon: "Truck"
        },
        {
            name: "Easy Returns",
            description: "Change your mind? Return within 30 days, no questions asked.",
            icon: "RotateCcw"
        },
        {
            name: "Secure Checkout",
            description: "Encrypted payments via Stripe & PayPal. Your data is safe.",
            icon: "CreditCard"
        }
    ]
};

async function fixTrustContent() {
    console.log("Updating Trust Section content to 'Authorized Hub' defaults...");

    const { data, error } = await supabase
        .from('homepage_sections')
        .upsert({
            section_type: 'trust_section',
            content_json: DEFAULT_CONTENT,
            is_active: true,
            updated_at: new Date().toISOString()
        }, { onConflict: 'section_type' });

    if (error) {
        console.error("Error updating trust section:", error);
    } else {
        console.log("Success! Trust section content reset.");
    }
}

fixTrustContent();
