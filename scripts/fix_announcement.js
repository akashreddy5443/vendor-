const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ANNOUNCEMENT_CONTENT = {
    text: "WELCOME TO TECHDEV STORE! FREE SHIPPING ON ORDERS OVER ₹2000",
    link: "/products",
    show: true
};

async function fixAnnouncementContent() {
    console.log("Updating Announcement Bar content...");

    const { data, error } = await supabase
        .from('homepage_sections')
        .upsert({
            section_type: 'announcement',
            content_json: ANNOUNCEMENT_CONTENT,
            is_active: true,
            updated_at: new Date().toISOString()
        }, { onConflict: 'section_type' });

    if (error) {
        console.error("Error updating announcement:", error);
    } else {
        console.log("Success! Announcement content set to user default.");
    }
}

fixAnnouncementContent();
