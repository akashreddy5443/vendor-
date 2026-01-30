const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function findProduct() {
    console.log('Searching for products...');
    const { data: products, error } = await supabase
        .from('products')
        .select('id, title, slug, status');

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log('Total Products found:', products.length);
    const targetSlug = 'mx-master-3s';
    const found = products.find(p => p.slug === targetSlug);

    if (found) {
        console.log('--- TARGET PRODUCT FOUND ---');
        console.log(found);
    } else {
        console.log(`--- PRODUCT NOT FOUND: ${targetSlug} ---`);
        console.log('Available Slugs:');
        products.forEach(p => console.log(`- ${p.slug} (${p.title})`[p.status]));
    }
}

findProduct();
