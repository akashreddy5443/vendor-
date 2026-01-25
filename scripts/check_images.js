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
    const { data } = await supabase
        .from('products')
        .select('title, product_images(cloudinary_url)')
        .ilike('title', '%MacBook%')

    console.log(JSON.stringify(data, null, 2));
}
check();
