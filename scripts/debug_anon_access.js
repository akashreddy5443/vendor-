
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase URL or Anon Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonSearch() {
    console.log('--- TESTING GUEST (ANON) ACCESS ---');
    const { data, error } = await supabase
        .from('products')
        .select('id, title, status')
        .limit(5);

    if (error) {
        console.error('❌ ACCESS DENIED / ERROR:', error);
    } else {
        console.log(`✅ SUCCESS. Found ${data.length} products as Guest.`);
        data.forEach(p => console.log(`   - ${p.title} (${p.status})`));
    }
}

testAnonSearch();
