const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse DATABASE_URL
let dbUrl = '';
const lines = envContent.split('\n');
for (const line of lines) {
    if (line.startsWith('POSTGRES_URL_NON_POOLING=')) {
        dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    } else if (!dbUrl && line.startsWith('DATABASE_URL=')) {
        dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    }
}

if (!dbUrl) {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(1);
}

const sql = `
DO $$
BEGIN
    -- Global Settings
    ALTER TABLE public.site_settings 
    ADD COLUMN IF NOT EXISTS global_discount_percentage DECIMAL(5,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS default_gst_percentage DECIMAL(5,2) DEFAULT 18;

    -- Product Fields
    ALTER TABLE public.products 
    ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(5,2) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS gst_percentage DECIMAL(5,2) DEFAULT NULL;
    
    RAISE NOTICE 'Pricing columns added successfully';
END $$;
`;

async function run() {
    const client = new Client({ connectionString: dbUrl });
    try {
        await client.connect();
        console.log('Connected to DB');
        await client.query(sql);
        console.log('Migration executed successfully');
    } catch (e) {
        console.error('Error executing SQL:', e);
    } finally {
        await client.end();
    }
}

run();
