const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load env specific for connection string
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let connectionString = '';

envContent.split('\n').forEach(line => {
    if (line.startsWith('POSTGRES_URL_NON_POOLING=')) {
        connectionString = line.split('=')[1].trim().replace(/"/g, '');
    }
});

if (!connectionString) {
    console.error('No POSTGRES_URL_NON_POOLING found in .env.local');
    // Fallback to PRISMA url if needed
    envContent.split('\n').forEach(line => {
        if (line.startsWith('POSTGRES_PRISMA_URL=')) {
            connectionString = line.split('=')[1].trim().replace(/"/g, '');
        }
    });
}

if (!connectionString) {
    console.error("Critical: No DB Connection String found.");
    process.exit(1);
}

console.log('Connecting to Database...');
// Add ssl: true for Supabase
const client = new Client({
    connectionString: connectionString,
});

async function applyFix() {
    try {
        await client.connect();
        console.log('Connected!');

        const sql = `
      -- 1. Create table
      CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          subscribed_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 2. Enable RLS
      ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

      -- 3. Drop old policies
      DROP POLICY IF EXISTS "Enable insert for all" ON public.newsletter_subscribers;
      DROP POLICY IF EXISTS "Enable read for all" ON public.newsletter_subscribers;
      DROP POLICY IF EXISTS "Public can subscribe" ON public.newsletter_subscribers;
      DROP POLICY IF EXISTS "Admin can view subscribers" ON public.newsletter_subscribers;

      -- 4. Create new policies
      CREATE POLICY "Enable insert for all" 
      ON public.newsletter_subscribers 
      FOR INSERT 
      WITH CHECK (true);

      CREATE POLICY "Enable read for all" 
      ON public.newsletter_subscribers 
      FOR SELECT 
      USING (true);
    `;

        await client.query(sql);
        console.log('✅ SQL Applied Successfully! Table created and policies set.');
    } catch (err) {
        console.error('❌ Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

applyFix();
