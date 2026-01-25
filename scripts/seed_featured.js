const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

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

const client = new Client({ connectionString });

async function seedFeatured() {
    try {
        await client.connect();
        console.log('Connected to DB...');

        // 1. Fetch 3 Random Products
        const { rows: products } = await client.query('SELECT id FROM products LIMIT 3');

        if (products.length === 0) {
            console.log('❌ No products found to feature.');
            process.exit(1);
        }

        const productIds = products.map(p => p.id);
        console.log('Feature Product IDs:', productIds);

        // 2. Update homepage_sections
        const contentJson = JSON.stringify({ productIds });

        // Upsert logic
        await client.query(`
            INSERT INTO homepage_sections (section_type, title, subtitle, content_json, is_active)
            VALUES ('featured', 'Featured Gear', 'Our top picks for this week.', $1, true)
            ON CONFLICT (section_type) 
            DO UPDATE SET content_json = $1, is_active = true;
        `, [contentJson]);

        console.log('✅ Successfully updated Featured Products.');

    } catch (err) {
        console.error('❌ Error Seeding Featured:', err);
    } finally {
        await client.end();
    }
}

seedFeatured();
