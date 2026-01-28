const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let dbUrl = '';
envContent.split('\n').forEach(line => {
    if (line.startsWith('POSTGRES_URL_NON_POOLING=')) {
        dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    }
});

const client = new Client({ connectionString: dbUrl });

async function check() {
    await client.connect();
    const headers = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'site_settings';
    `);
    console.log('Columns:', headers.rows.map(r => r.column_name));
    await client.end();
}
check();
