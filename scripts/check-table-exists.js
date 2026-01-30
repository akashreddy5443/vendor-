const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
    ssl: {
        rejectUnauthorized: false
    }
});

async function checkTable() {
    try {
        await client.connect();
        const res = await client.query("SELECT count(*) FROM information_schema.tables WHERE table_name = 'reviews'");
        if (res.rows[0].count === '0') {
            console.log("Table 'reviews' DOES NOT EXIST");
        } else {
            console.log("Table 'reviews' EXISTS");
            const countRes = await client.query("SELECT count(*) FROM reviews");
            console.log(`Total reviews in table: ${countRes.rows[0].count}`);
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

checkTable();
