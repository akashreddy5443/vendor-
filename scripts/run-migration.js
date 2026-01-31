const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    console.error('Error: POSTGRES_URL or DATABASE_URL not found in .env');
    process.exit(1);
}

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Connecting to database...');
        await client.connect();

        const migrationPath = path.join(__dirname, '../migrations/phase2_add_brand.sql');
        console.log(`Reading migration from ${migrationPath}...`);
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Executing migration...');
        await client.query(sql);

        console.log('Migration successful!');
    } catch (e) {
        console.error('Migration failed:', e);
        process.exit(1);
    } finally {
        await client.end();
    }
}

run();
