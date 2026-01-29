const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Or prefer service role if available for admin access, but anon might work if policies allow reading
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || (!supabaseKey && !supabaseServiceKey)) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

async function checkTypes() {
    console.log('Fetching distinct section_types from homepage_sections...');

    // Fetch all rows (assuming table is small) to check types
    const { data, error } = await supabase
        .from('homepage_sections')
        .select('section_type, id');

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    const types = new Set();
    data.forEach(row => {
        types.add(row.section_type);
    });

    console.log('--- FOUND TYPES ---');
    console.log(Array.from(types));
    console.log('-------------------');

    // Check specifically for what violates the constraint
    const allowed = [
        'hero',
        'featured',
        'categories',
        'footer',
        'lifestyle_grid',
        'trending_spotlight',
        'hero_slider',
        'announcement_bar',
        'promo_banners'
    ];

    const invalid = data.filter(r => !allowed.includes(r.section_type));

    if (invalid.length > 0) {
        console.log('!!! FOUND INVALID ROWS VIOLATING CONSTRAINT !!!');
        invalid.forEach(r => console.log(`ID: ${r.id}, Type: "${r.section_type}"`));
        console.log('You must DELETE these rows or ADD this type to the constraint.');
    } else {
        console.log('All rows seem to match the expected allowed list. Maybe the constraint list had a typo?');
    }
}

checkTypes();
