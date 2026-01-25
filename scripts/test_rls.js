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
    console.log("Checking PDP fetch with ANON KEY...");
    const slug = 'macbook-pro-16';
    const { data: product, error } = await supabase
        .from('products')
        .select('title, slug')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single();

    if (error) console.error("Error (RLS blocked?):", error);
    else console.log("Success (RLS Open):", product);
}

check();
