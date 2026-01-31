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

async function run() {
    console.log('Making all coupons public...');
    const client = new Client({ connectionString: dbUrl });
    try {
        await client.connect();
        await client.query("UPDATE coupons SET is_public = true WHERE is_active = true");
        console.log('All active coupons marked as public successfully');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
