const { createClient } = require('@supabase/supabase-js');
// Need to load env vars manually if running independent node script without dotenv
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/"/g, '');
        env[key] = value;
    }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkTemplates() {
    const { data, error } = await supabase.from('notification_templates').select('*');
    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

checkTemplates();
