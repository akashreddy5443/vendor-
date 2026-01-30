const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testQueryRelations() {
    const slug = 'mx-master-3s';

    console.log('--- Testing Individual Relations ---');

    const tests = [
        { name: 'Products only', select: '*' },
        { name: 'Categories', select: '*, categories(id, name, slug)' },
        { name: 'Product Images', select: '*, product_images(*)' },
        { name: 'Reviews', select: '*, reviews(*)' },
        { name: 'Product Reviews (Alt)', select: '*, product_reviews(*)' }
    ];

    for (const test of tests) {
        process.stdout.write(`Testing ${test.name}... `);
        const { error } = await supabase
            .from('products')
            .select(test.select)
            .eq('slug', slug)
            .maybeSingle();

        if (error) {
            console.log(`FAILED: ${error.message}`);
        } else {
            console.log(`SUCCESS`);
        }
    }
}

testQueryRelations();
