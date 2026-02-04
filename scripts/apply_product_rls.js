
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const fs = require('fs');

const connectionString = process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;

async function applyFix() {
    console.log('Connecting to database...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const sql = fs.readFileSync('./scripts/fix_product_rls.sql', 'utf8');
        console.log('Applying RLS Policy...');
        await client.query(sql);
        console.log('✅ RLS Policy Applied Successfully!');
    } catch (err) {
        console.error('❌ Error applying fix:', err);
    } finally {
        await client.end();
    }
}

applyFix();
