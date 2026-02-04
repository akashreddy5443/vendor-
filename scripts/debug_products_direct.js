
const { Client } = require('pg');

// Hardcoded for reliability in debugging
const connectionString = "postgres://postgres.reokmwqcdzofbimdwcxp:kvxU0mGeXZ1dcI7d@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require";

async function checkProducts() {
    console.log('🔗 Connecting to DB...');
    const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();

        console.log('--- SEARCHING FOR "macbook" ---');
        // Check case-insensitive title or description
        const res = await client.query(`
            SELECT id, title, status, stock 
            FROM products 
            WHERE title ILIKE '%macbook%' OR description ILIKE '%macbook%'
            LIMIT 10;
        `);

        if (res.rows.length === 0) {
            console.log('❌ No products found matching "macbook"');

            // Fallback: List ANY products to prove DB has data
            console.log('--- LISTING FIRST 5 PRODUCTS ---');
            const all = await client.query('SELECT id, title, status FROM products LIMIT 5');
            console.table(all.rows);
        } else {
            console.log(`✅ Found ${res.rows.length} MacBook products:`);
            console.table(res.rows);
        }

    } catch (err) {
        console.error('❌ DB Error:', err);
    } finally {
        await client.end();
    }
}

checkProducts();
