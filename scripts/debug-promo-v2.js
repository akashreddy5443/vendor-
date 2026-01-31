require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

// Create client with custom fetch to handle SSL if needed (though supabase-js usually handles it via options)
// Actually, standard client might fail if Node environment is strict.
// Let's try direct PG query instead as it is more reliable for "raw" inspection and I have connection string.
const { Client } = require('pg');

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL;

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // <--- This fixes the SELF_SIGNED_CERT error
    }
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to DB');

        const res = await client.query("SELECT id, section_type, content_json FROM homepage_sections WHERE section_type = 'promo_grid'");

        console.log(`Found ${res.rowCount} rows.`);
        res.rows.forEach(row => {
            console.log(`--- Row ID: ${row.id} ---`);
            console.log(JSON.stringify(row.content_json, null, 2));
        });

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run();
