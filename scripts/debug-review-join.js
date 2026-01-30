const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugReviews() {
    console.log("Attempting to fetch reviews with products join...");
    const { data, error } = await supabase
        .from('reviews')
        .select(`
            *,
            products ( title )
        `)
        .limit(1);

    if (error) {
        console.error("Join Error:", error.message);
        console.error("Details:", error.details);
        console.error("Hint:", error.hint);
    } else {
        console.log("Fetch successful:", data);
    }
}

debugReviews();
