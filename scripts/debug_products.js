
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listProducts() {
    console.log('Fetching products...');
    const { data, error } = await supabase
        .from('products')
        .select('id, title, status, stock')
        .limit(20);

    if (error) {
        console.error('Error:', error);
    } else {
        console.table(data);
    }
}

listProducts();
