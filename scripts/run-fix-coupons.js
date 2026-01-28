process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function run() {
    try {
        await client.connect();

        const sql = fs.readFileSync(path.join(__dirname, '../migrations/fix_coupons_schema.sql'), 'utf8');

        console.log('Running schema fix...');
        await client.query(sql);
        console.log('Schema fix successful!');

    } catch (err) {
        console.error('Error running migration:', err);
    } finally {
        await client.end();
    }
}

run();
