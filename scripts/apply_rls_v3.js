
const { Client } = require('pg');
const fs = require('fs');

// Hardcoded for reliability in this specific run context
const connectionString = "postgres://postgres.reokmwqcdzofbimdwcxp:kvxU0mGeXZ1dcI7d@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require";

async function applyFix() {
    console.log('🔗 Connecting to database...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const sql = fs.readFileSync('./scripts/fix_product_rls_v2.sql', 'utf8');
        console.log('🔧 Applying Comprehensive RLS Policy...');
        await client.query(sql);
        console.log('✅ Success! Public Read Access enabled for Guests, Users, and Admins.');
    } catch (err) {
        console.error('❌ Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

applyFix();
