const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let url = '';
let key = '';

envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        url = line.split('=')[1].trim().replace(/"/g, '');
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
        key = line.split('=')[1].trim().replace(/"/g, '');
    }
});

const supabase = createClient(url, key);

async function check() {
    console.log("Testing Search Query...");
    const minPrice = 100;
    const maxPrice = 10000;
    const query = 'macbook';

    // Simulate functionality in search/page.tsx
    let dbQuery = supabase
        .from('products')
        .select('title, price')
        .eq('status', 'active')
        .gte('price', minPrice)
        .lte('price', maxPrice)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`) // The suspect line

    const { data, error } = await dbQuery;

    if (error) {
        console.error("Query Error:", error);
    } else {
        console.log(`Found ${data.length} items (Max Price ${maxPrice}):`);
        data.forEach(p => console.log(`- ${p.title}: ${p.price}`));
    }
}

check();
