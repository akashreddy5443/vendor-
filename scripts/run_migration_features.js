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

async function run() {
    await client.connect();
    try {
        console.log("Adding features column...");
        await client.query(`
            ALTER TABLE public.products
            ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
        `);
        console.log("Success!");
    } catch (e) {
        console.error("Migration Error:", e);
    } finally {
        await client.end();
    }
}
run();
