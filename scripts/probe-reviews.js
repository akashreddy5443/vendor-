const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function findTableNames() {
    const list = ['reviews', 'product_reviews', 'reviews_product', 'product_feedback'];
    console.log('--- Probing for Review Tables ---');
    for (const name of list) {
        process.stdout.write(`Checking '${name}'... `);
        const { error } = await supabase.from(name).select('id').limit(1);
        if (error) {
            console.log(`FAILED: ${error.message}`);
        } else {
            console.log(`SUCCESS!`);
        }
    }
}

findTableNames();
