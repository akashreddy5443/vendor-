
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Client } = require('pg');

const connectionString = "postgres://postgres.reokmwqcdzofbimdwcxp:kvxU0mGeXZ1dcI7d@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

async function checkStatus() {
    console.log('🔌 Connecting to DB to list statuses...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false, checkServerIdentity: () => undefined }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT title, status FROM products WHERE title ILIKE '%macbook%'");

        console.log(`✅ Found ${res.rows.length} MacBook products:`);
        console.table(res.rows);

        const distinctStatuses = await client.query("SELECT DISTINCT status FROM products");
        console.log("ALL Distinct Statuses in DB:", distinctStatuses.rows);

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.end();
    }
}

checkStatus();
