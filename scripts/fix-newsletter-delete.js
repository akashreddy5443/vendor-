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
    // Fallback
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

const client = new Client({
    connectionString: connectionString,
});

async function applyFix() {
    try {
        await client.connect();
        console.log('Connected to DB...');

        const sql = `
      -- Allow Delete for Authenticated Users (Admins)
      DROP POLICY IF EXISTS "Enable delete for authenticated" ON public.newsletter_subscribers;
      
      CREATE POLICY "Enable delete for authenticated"
      ON public.newsletter_subscribers
      FOR DELETE
      USING (auth.role() = 'authenticated');
      
      -- Fallback: If auth logic is messy, just allow all for this specific table to unblock user
      -- (Uncomment if still failing)
      -- CREATE POLICY "Enable delete for all" ON public.newsletter_subscribers FOR DELETE USING (true);
    `;

        await client.query(sql);
        console.log('✅ DELETE Policy Applied Successfully.');
    } catch (err) {
        console.error('❌ Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

applyFix();
