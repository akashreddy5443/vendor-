
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function listOrders() {
    console.log('Listing orders...');
    const { data, error } = await supabase.from('orders').select('id, status, created_at').limit(5);
    if (error) {
        console.error('Error fetching orders:', error);
    } else {
        console.log('Orders found:', data.length);
        console.log(data);
    }
}

listOrders();
