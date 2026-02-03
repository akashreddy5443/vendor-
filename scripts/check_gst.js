
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Env Vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking Products...');
    const { data: products, error } = await supabase
        .from('products')
        .select('title, gst_percentage, price')
        .ilike('title', '%MacBook%');

    if (error) console.error('Error:', error);
    else console.log('Products:', products);

    console.log('Checking Settings...');
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .single();

    console.log('Settings:', settings);
}

check();
