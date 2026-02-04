
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Use Service Role to ensure we see EVERYTHING
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMacBook() {
    console.log('--- SEARCHING DB FOR "macbook" ---');

    // 1. Check strict match
    const { data: exact, error: err1 } = await supabase
        .from('products')
        .select('id, title, status')
        .ilike('title', '%macbook%');

    console.log('Title Search Results:', exact?.length || 0);
    if (exact?.length > 0) console.table(exact);

    // 2. Check description match
    const { data: desc, error: err2 } = await supabase
        .from('products')
        .select('id, title, status')
        .ilike('description', '%macbook%');

    console.log('Description Search Results:', desc?.length || 0);
    if (desc?.length > 0) console.table(desc);
}

checkMacBook();
