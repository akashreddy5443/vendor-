
const { Client } = require('pg');

// Using the NON-POOLING URL from .env.local (Step 19549) which is more reliable for direct admin tasks
const connectionString = "postgres://postgres.reokmwqcdzofbimdwcxp:kvxU0mGeXZ1dcI7d@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require";

const sql = `
-- 1. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to clear the slate
DROP POLICY IF EXISTS "Public Read Access" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Public Read Access of Products" ON products;

-- 3. Create the MASTER policy (Allow All)
CREATE POLICY "Public Read Access of Products" 
ON products FOR SELECT 
USING (true);

-- 4. Grant Permissions explicitly
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;
GRANT SELECT ON products TO service_role;

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
`;

async function fixRLS() {
    console.log('🔗 Connecting to DB via Non-Pooling URL...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Crucial for self-signed certs in dev/pooler
    });

    try {
        await client.connect();
        console.log('🔧 Applying RLS Policies...');
        await client.query(sql);
        console.log('✅ RLS Policies Applied Successfully!');

        // Verification Query
        console.log('🕵️ Verifying with a test query...');
        const res = await client.query("SELECT count(*) FROM products");
        console.log(`📊 Products in DB: ${res.rows[0].count}`);

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.end();
    }
}

fixRLS();
