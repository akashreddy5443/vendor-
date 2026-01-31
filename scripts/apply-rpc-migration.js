const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let dbUrl = '';
envContent.split('\n').forEach(line => {
    if (line.startsWith('POSTGRES_URL_NON_POOLING=')) {
        dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    }
});

// Use absolute path for RPC migration
const sqlPath = 'C:\\Users\\Akash\\.gemini\\antigravity\\brain\\cd410c16-6542-4f5d-894c-a18f92a747bb\\migration_increment_coupon.sql';
const sql = fs.readFileSync(sqlPath, 'utf-8');

async function run() {
    console.log('Applying RPC migration...');
    const client = new Client({ connectionString: dbUrl });
    try {
        await client.connect();
        await client.query(sql);
        console.log('RPC Migration applied successfully');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
