const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();

        // Check columns
        const res = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'coupons';
    `);

        const columns = res.rows.map(r => r.column_name);
        console.log('Columns in coupons table:', columns);

        if (!columns.includes('expires_at')) {
            console.log('expires_at column is MISSING. Adding it...');
            await client.query(`ALTER TABLE public.coupons ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;`);
            console.log('Added expires_at column.');
        } else {
            console.log('expires_at column EXISTS.');
        }

        // Also check for other columns just in case
        if (!columns.includes('min_order_value')) {
            await client.query(`ALTER TABLE public.coupons ADD COLUMN min_order_value DECIMAL(10, 2) DEFAULT 0;`);
            console.log('Added min_order_value column.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
