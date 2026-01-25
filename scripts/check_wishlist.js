const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let connectionString = '';
envContent.split('\n').forEach(line => {
    if (line.startsWith('POSTGRES_URL_NON_POOLING=')) {
        connectionString = line.split('=')[1].trim().replace(/"/g, '');
    }
});
if (!connectionString) {
    envContent.split('\n').forEach(line => {
        if (line.startsWith('POSTGRES_PRISMA_URL=')) {
            connectionString = line.split('=')[1].trim().replace(/"/g, '');
        }
    });
}
const client = new Client({ connectionString });

async function check() {
    await client.connect();

    // Check if table exists
    const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name = 'wishlist'
    `);

    if (res.rows.length === 0) {
        console.log("Wishlist Table: MISSING");
    } else {
        console.log("Wishlist Table: FOUND");
        // Check Policies
        const pol = await client.query("SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'wishlist'");
        console.log("Policies:", pol.rows);
    }
    await client.end();
}
check();
