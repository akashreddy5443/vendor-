const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkProduct() {
    const slug = 'mx-master-3s';
    const { data: product, error } = await supabase
        .from('products')
        .select('id, title, slug, is_active')
        .eq('slug', slug)
        .maybeSingle();

    if (error) {
        console.error('Database Error:', error.message);
        return;
    }

    if (product) {
        console.log('--- PRODUCT FOUND ---');
        console.log(product);
    } else {
        console.log(`--- PRODUCT NOT FOUND: ${slug} ---`);
        const { data: allProducts } = await supabase
            .from('products')
            .select('title, slug')
            .limit(20);
        console.log('Existing Slugs:');
        allProducts.forEach(p => console.log(`- ${p.slug} (${p.title})`));
    }
}

checkProduct();
