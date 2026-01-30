const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkReviews() {
    try {
        await client.connect();
        const res = await client.query('SELECT * FROM reviews ORDER BY created_at DESC');
        console.log(`Found ${res.rows.length} reviews:`);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

checkReviews();
