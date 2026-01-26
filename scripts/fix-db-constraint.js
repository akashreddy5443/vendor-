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
    if (line.startsWith('DATABASE_URL=')) {
        dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    } else if (line.startsWith('POSTGRES_URL_NON_POOLING=')) { // Prefer non-pooling for DDL
        dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    } else if (!dbUrl && line.startsWith('POSTGRES_PRISMA_URL=')) {
        dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    }
}

if (!dbUrl) {
    console.error('DATABASE_URL not found in .env.local');
    process.exit(1);
}

// SQL to fix constraint
// We drop the constraint and re-add it with a comprehensive list
const sql = `
DO $$
BEGIN
    ALTER TABLE public.homepage_sections DROP CONSTRAINT IF EXISTS homepage_sections_section_type_check;
    
    ALTER TABLE public.homepage_sections ADD CONSTRAINT homepage_sections_section_type_check 
    CHECK (section_type IN ('hero', 'featured', 'categories', 'footer', 'about_page', 'promo_banner', 'newsletter', 'announcement'));
    
    RAISE NOTICE 'Constraint updated successfully';
END $$;
`;

async function run() {
    const client = new Client({
        connectionString: dbUrl,
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        // const res = await client.query("SELECT DISTINCT section_type FROM public.homepage_sections");
        // console.log('Existing section_types:', res.rows);

        await client.query(sql);
        console.log('SQL executed successfully');
    } catch (e) {
        console.error('Error executing SQL:', e);
    } finally {
        await client.end();
    }
}

run();
