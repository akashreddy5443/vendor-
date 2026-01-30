const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkReviewsTable() {
    console.log('--- TABLE CHECK ---');

    const { data: r1, error: e1 } = await supabase.from('reviews').select('id').limit(1);
    console.log(`Table 'reviews': ${e1 ? 'NOT FOUND (' + e1.message + ')' : 'EXISTS'}`);

    const { data: r2, error: e2 } = await supabase.from('product_reviews').select('id').limit(1);
    console.log(`Table 'product_reviews': ${e2 ? 'NOT FOUND (' + e2.message + ')' : 'EXISTS'}`);
}

checkReviewsTable();
