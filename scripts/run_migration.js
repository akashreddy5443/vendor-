process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Using service role if available, or just anon (might fail if RLS blocks DDL, but usually need service role for DDL... wait, anon key can't run DDL).
// Actually, I don't have the service role key exposed usually.
// But I can try to use a Postgres Client if I have the connection string.
// I saw "fixDatabasePermissions" in actions.ts uses `pg` and `process.env.POSTGRES_URL`.
// I will use that approach.

const { Client } = require('pg');

async function runMigration() {
    console.log('Starting migration...');

    // Try to get connection string from env
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;

    if (!connectionString) {
        console.error('No database connection string found in environment variables.');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();

        console.log('Connected to database. Running DDL...');

        await client.query(`
            ALTER TABLE site_settings 
            ADD COLUMN IF NOT EXISTS tax_label text DEFAULT 'GST',
            ADD COLUMN IF NOT EXISTS tax_breakdown_enabled boolean DEFAULT true;
        `);

        console.log('Migration successful: Columns added.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
