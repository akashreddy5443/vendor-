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

const sql = fs.readFileSync(path.join(__dirname, '../migrations/fix_settings_rls.sql'), 'utf-8');

async function run() {
    const client = new Client({ connectionString: dbUrl });
    try {
        await client.connect();
        await client.query(sql);
        console.log('Fix applied successfully');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
