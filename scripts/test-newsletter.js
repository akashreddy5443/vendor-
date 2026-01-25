const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim().replace(/"/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: We use ANON key to simulate client-side/server-action behavior restricted by RLS.
// If we used Service Role, we would bypass RLS and not reproduce the user's issue.

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSubscribe() {
    const testEmail = `test_duplicate@example.com`;
    console.log(`1. Attempting to subscribe with: ${testEmail}`);

    // First Insert
    const { data: d1, error: e1 } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: testEmail })
        .select();

    if (e1) {
        // If 23505, it means it already exists (good). If other, bad.
        console.log('First Insert Result:', e1.code);
    } else {
        console.log('First Insert Success.');
    }

    console.log(`2. Attempting DUPLICATE subscription with: ${testEmail}`);

    // Second Insert (Should Fail)
    const { data: d2, error: e2 } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: testEmail })
        .select();

    if (e2) {
        console.log('--------------- DUPLICATE ERROR DETAILS ---------------');
        console.log('Error Code:', e2.code); // WE NEED THIS
        console.log('Error Message:', e2.message);
        console.log('-------------------------------------------------------');
    } else {
        console.log('ERROR: Duplicate was allowed?!');
    }

    console.log(`3. Listing ALL Subscribers (Testing Select Policy)...`);
    const { data: list, error: listError } = await supabase
        .from('newsletter_subscribers')
        .select('*');

    if (listError) {
        console.error('List Error:', listError);
    } else {
        console.log(`Found ${list.length} subscribers.`);
        console.log(list);
    }
}

testSubscribe();
