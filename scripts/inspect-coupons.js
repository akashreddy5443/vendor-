process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        console.log('Sanitizing coupon codes...');
        await client.query("UPDATE coupons SET code = UPPER(TRIM(code))");
        const res = await client.query('SELECT id, code, is_active FROM coupons');
        console.log('Coupons in DB:', res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();
