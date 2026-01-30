
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
    console.log('Testing category access...');
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error('Error fetching categories:', error);
    } else {
        console.log('Categories found:', data.length);
        console.log(data);
    }
}

test();
