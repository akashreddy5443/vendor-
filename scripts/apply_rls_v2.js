
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');

// Try POSTGRES_URL first (Vercel standard), then fall back
const connectionString = process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;

async function applyFix() {
    console.log('🔗 Connecting to database...');
    // Log the host to verify we are targeting the right DB (obfuscating password)
    if (connectionString) {
        console.log('Target Host:', connectionString.split('@')[1]?.split(':')[0]);
    } else {
        console.error('❌ No connection string found in .env.local');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const sql = fs.readFileSync('./scripts/fix_product_rls_v2.sql', 'utf8');
        console.log('🔧 Applying Comprehensive RLS Policy...');
        await client.query(sql);
        console.log('✅ Success! Public Read Access enabled for Guests, Users, and Admins.');
    } catch (err) {
        console.error('❌ Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

applyFix();
