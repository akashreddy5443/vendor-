
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
const client = new Client({ connectionString });

async function runMigration() {
    try {
        await client.connect();
        const sql = fs.readFileSync('C:\\Users\\Akash\\.gemini\\antigravity\\brain\\cd410c16-6542-4f5d-894c-a18f92a747bb\\migration_fix_track_and_cats.sql', 'utf8');
        await client.query(sql);
        console.log('Migration applied successfully!');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await client.end();
    }
}

runMigration();
