
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Simulate exactly what the browser/API does
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSearchAPI() {
    console.log('--- SIMULATING API SEARCH LOCALLY ---');
    const query = "macbook";

    // Exact copy of the query from route.ts
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            id,
            title,
            status,
            description
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('status', 'active')
        .limit(6);

    if (error) {
        console.error('❌ API Query Failed:', error);
    } else {
        console.log(`✅ API Query Success. Found ${products.length} items.`);
        if (products.length === 0) {
            console.log('⚠️ Result is empty. RLS or Data issue.');
        } else {
            products.forEach(p => console.log(`   - ${p.title} [${p.status}]`));
        }
    }
}

testSearchAPI();
