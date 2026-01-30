const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkRelations() {
    const slug = 'mx-master-3s';

    // 1. Fetch product first
    const { data: product } = await supabase.from('products').select('id, title, category_id').eq('slug', slug).maybeSingle();

    if (!product) {
        console.log('Product not found by slug:', slug);
        return;
    }

    console.log('Product found:', product.title, 'ID:', product.id);

    // 2. Check product_images
    const { data: images, error: imgError } = await supabase.from('product_images').select('*').eq('product_id', product.id);
    console.log(`Images found: ${images?.length || 0}`, imgError ? `Error: ${imgError.message}` : '');

    // 3. Check categories
    if (product.category_id) {
        const { data: cat, error: catError } = await supabase.from('categories').select('*').eq('id', product.category_id).maybeSingle();
        console.log(`Category found: ${cat ? cat.name : 'NO'}`, catError ? `Error: ${catError.message}` : '');
    } else {
        console.log('Product has NO category_id');
    }

    // 4. Check reviews
    const { data: revs, error: revError } = await supabase.from('reviews').select('*').eq('product_id', product.id);
    console.log(`Reviews found: ${revs?.length || 0}`, revError ? `Error: ${revError.message}` : '');

    // 5. Try the full query used in the page
    console.log('\n--- ATTEMPTING FULL QUERY ---');
    const { data: fullProduct, error: fullError } = await supabase
        .from('products')
        .select(`
            *,
            product_images (*),
            categories (id, name, slug),
            reviews (*)
        `)
        .eq('slug', slug)
        .maybeSingle();

    if (fullError) {
        console.error('Full Query FAILED:', fullError.message);
        console.error('Details:', fullError.details);
        console.error('Hint:', fullError.hint);
    } else if (fullProduct) {
        console.log('Full Query SUCCESSFUL');
    } else {
        console.log('Full Query returned NULL');
    }
}

checkRelations();
