
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Client } = require('pg');

const connectionString = "postgres://postgres.reokmwqcdzofbimdwcxp:kvxU0mGeXZ1dcI7d@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

async function listTitles() {
    console.log('🔌 Connecting to DB to list titles...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false, checkServerIdentity: () => undefined }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT id, title, status FROM products ORDER BY created_at DESC LIMIT 20");
        console.log(`✅ Found ${res.rows.length} products:`);
        console.table(res.rows);

        const hasMacBook = res.rows.some(r => r.title.toLowerCase().includes('macbook'));
        if (hasMacBook) {
            console.log("🎯 CONFIRMED: MacBook exists in the database.");
        } else {
            console.log("⚠️ WARNING: No product with 'MacBook' in the title found.");
        }

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.end();
    }
}

listTitles();
