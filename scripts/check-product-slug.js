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
    console.log(`Checking for product with slug: ${slug}`);

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

    if (error) {
        console.error('Error fetching product:', error.message);
    } else if (data) {
        console.log('Product Found:');
        console.log(JSON.stringify(data, null, 2));
    } else {
        console.log('Product NOT FOUND in database.');

        // Let's list some slugs that DO exist to see if it's a naming issue
        const { data: others } = await supabase
            .from('products')
            .select('title, slug')
            .limit(10);

        console.log('\nOther available products:');
        console.table(others);
    }
}

checkProduct();
