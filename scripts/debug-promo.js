require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    console.log('URL:', supabaseUrl);
    console.log('KEY:', supabaseKey ? 'Set' : 'Missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPromo() {
    const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'promo_grid');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Found rows:', data.length);
        data.forEach((row, i) => {
            console.log(`Row ${i} ID:`, row.id);
            console.log(`Row ${i} Content:`, JSON.stringify(row.content_json, null, 2));
        });
    }
}

checkPromo();
