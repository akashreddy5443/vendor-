const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read .env.local
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

    console.log('--- Columns in site_settings ---');
    const cols = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'site_settings';
    `);
    cols.rows.forEach(r => console.log(`${r.column_name} (${r.data_type})`));

    console.log('\n--- RLS Policies on site_settings ---');
    const policies = await client.query(`
        SELECT policyname, cmd, roles 
        FROM pg_policies 
        WHERE tablename = 'site_settings';
    `);
    policies.rows.forEach(r => console.log(`${r.policyname} - ${r.cmd} - ${r.roles}`));

    console.log('\n--- RLS Enabled? ---');
    const rls = await client.query(`
        SELECT relname, relrowsecurity 
        FROM pg_class 
        WHERE relname = 'site_settings';
    `);
    console.log(rls.rows[0]);

    await client.end();
}

check();
