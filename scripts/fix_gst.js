
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Env Vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
    console.log('Fixing MacBook GST...');
    // Reset specific product to use global default (null)
    const { data, error } = await supabase
        .from('products')
        .update({ gst_percentage: null })
        .ilike('title', '%MacBook%')
        .select();

    if (error) console.error('Error updating product:', error);
    else console.log('Updated Product:', data);

    console.log('Ensuring Global Settings is 5%...');
    const { data: settings, error: sErr } = await supabase
        .from('site_settings')
        .update({ default_gst_percentage: 5 })
        .neq('id', 0) // Update all rows (should be only one)
        .select();

    if (sErr) console.error('Error updating settings:', sErr);
    else console.log('Updated Settings:', settings);
}

fix();
