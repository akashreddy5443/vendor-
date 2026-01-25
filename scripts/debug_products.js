const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/"/g, '');
        env[key] = value;
    }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function debugProducts() {
    console.log("Checking products via Supabase Client (Simulating Frontend)...");
    const { data, error, count } = await supabase.from('products').select('*', { count: 'exact' });

    if (error) {
        console.error("❌ Supabase Error:", error);
    } else {
        console.log(`✅ Found ${count} products via Supabase Public Client.`);
        if (data.length > 0) {
            console.log("Sample:", data[0].title);
        }
    }

    const { Client } = require('pg');
    let connectionString = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_PRISMA_URL;

    if (connectionString) {
        console.log("\nChecking products via Direct Postgres Connection...");
        const client = new Client({ connectionString });
        await client.connect();
        const res = await client.query('SELECT count(*) FROM products');
        console.log(`✅ Found ${res.rows[0].count} products via Direct Postgres.`);
        await client.end();
    } else {
        console.log("No Postgres connection string found for direct check.");
    }
}

debugProducts();
