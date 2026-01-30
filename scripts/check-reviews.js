const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkReviews() {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return;
    }

    console.log(`Found ${data.length} reviews:`);
    console.log(JSON.stringify(data, null, 2));
}

checkReviews();
