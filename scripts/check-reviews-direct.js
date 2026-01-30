const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkReviewsSchema() {
    // We can't easily query information_schema via Supabase JS if RLS is on 
    // and we are using Anon key. But let's try a direct query if possible.
    // Actually, let's just check if we can query reviews by product_id.

    const productId = 'some-uuid'; // We'll get a real one
    const { data: product } = await supabase.from('products').select('id').limit(1).single();
    if (!product) {
        console.log('No products found to test with.');
        return;
    }

    console.log('Testing reviews query for product:', product.id);
    const { data, error } = await supabase.from('reviews').select('*').eq('product_id', product.id);

    if (error) {
        console.error('Query reviews table directly FAILED:', error.message);
    } else {
        console.log('Query reviews table directly SUCCESSFUL, found:', data.length);
    }
}

checkReviewsSchema();
