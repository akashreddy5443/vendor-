
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const connectionString = process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;

async function checkPolicies() {
    // Parse host to verify env
    const host = connectionString ? connectionString.split('@')[1].split(':')[0] : 'UNKNOWN';
    console.log('Connecting to host:', host);

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT policyname, cmd, roles 
            FROM pg_policies 
            WHERE tablename = 'orders';
        `);
        console.table(res.rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkPolicies();
