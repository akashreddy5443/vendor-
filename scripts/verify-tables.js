const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listTables() {
    // There isn't a direct 'list tables' in Supabase JS easily, 
    // but we can try to query common names or use the error hints.
    const tablesToTry = ['reviews', 'product_reviews', 'product_images', 'categories', 'products'];

    for (const table of tablesToTry) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (error) {
            console.log(`Table '${table}': NOT FOUND or Error (${error.message})`);
        } else {
            console.log(`Table '${table}': EXISTS`);
        }
    }
}

listTables();
