
// 1. DISABLE SSL CHECKS (Critical for local connection to Supabase Pooler)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Client } = require('pg');

// Using the verified connection string from .env.local
// Removing 'sslmode=require' from the string to let our config handle it
const connectionString = "postgres://postgres.reokmwqcdzofbimdwcxp:kvxU0mGeXZ1dcI7d@aws-1-us-east-1.pooler.supabase.com:5432/postgres";

const sql = `
BEGIN;

-- 1. Enable RLS (Good practice)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL potentially conflicting policies
DROP POLICY IF EXISTS "Public Read Access" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Public Read Access of Products" ON products;
DROP POLICY IF EXISTS "Give me access" ON products;

-- 3. Create ONE policy to rule them all
CREATE POLICY "Public_Read_Access_Final" 
ON products FOR SELECT 
TO public 
USING (true);

-- 4. Grant Permissions Explicitly
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;
GRANT SELECT ON products TO service_role;

-- 5. Grant Schema Usage (Often the hidden culprit)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

COMMIT;
`;

async function applyFix() {
    console.log('🔌 Connecting to Database (SSL Check Disabled)...');

    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false, // Accept self-signed certs
            checkServerIdentity: () => undefined // Disable hostname checking
        }
    });

    try {
        await client.connect();
        console.log('🔨 Applying "Nuclear" RLS Fix...');
        await client.query(sql);
        console.log('✅ RLS Policy Applied Successfully!');

        // Verification
        const res = await client.query("SELECT count(*) FROM products");
        console.log(`📊 Current Product Count in DB: ${res.rows[0].count}`);

    } catch (err) {
        console.error('❌ Fail:', err);
    } finally {
        await client.end();
    }
}

applyFix();
