const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
let dbUrl = '';
envContent.split('\n').forEach(line => {
    if (line.startsWith('POSTGRES_URL_NON_POOLING=')) {
        dbUrl = line.split('=')[1].replace(/"/g, '').trim();
    }
});

const sql = `
    -- Disable RLS completely for site_settings
    ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

    -- Ensure row 1 exists
    INSERT INTO public.site_settings (id, site_name, maintenance_mode)
    VALUES (1, 'TechDev Store', false)
    ON CONFLICT (id) DO NOTHING;

    -- Grant permissions
    GRANT ALL ON public.site_settings TO postgres;
    GRANT ALL ON public.site_settings TO public;
    GRANT ALL ON public.site_settings TO anon;
    GRANT ALL ON public.site_settings TO authenticated;
    GRANT ALL ON public.site_settings TO service_role;
`;

async function run() {
    const client = new Client({ connectionString: dbUrl });
    try {
        await client.connect();
        await client.query(sql);
        console.log('Nuclear DB Fix applied: RLS disabled for site_settings');
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
