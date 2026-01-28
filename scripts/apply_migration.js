
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' }); // Try .env.local first
require('dotenv').config(); // Fallback to .env

async function runMigration() {
    if (!process.env.DATABASE_URL) {
        console.error('Error: DATABASE_URL is not defined in .env or .env.local');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for Supabase/Neon usually
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        const sqlPath = path.join(__dirname, '../migrations/fix_orders_rls.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration: fix_orders_rls.sql');
        await client.query(sql);
        console.log('Migration applied successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
