
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
    console.log('--- CHECKING PROD DATA ---');
    const { data, error } = await supabase
        .from('products')
        .select('title, status, description')
        .limit(5);

    if (error) {
        console.error('DB Error:', error);
    } else {
        console.log('Products Found:', data.length);
        data.forEach(p => console.log(`- ${p.title} [${p.status}]`));
    }
}

checkData();
