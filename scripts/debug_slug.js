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
    envContent.split('\n').forEach(line => {
        if (line.startsWith('POSTGRES_PRISMA_URL=')) {
            connectionString = line.split('=')[1].trim().replace(/"/g, '');
        }
    });
}
const client = new Client({ connectionString });

async function check() {
    await client.connect();
    // Check Slug
    const res = await client.query("SELECT id, title, slug FROM products WHERE slug = 'dell-xps-15'");
    console.log("Product Slug Check:", res.rows);

    // Check Category 'laptop' vs 'laptops'
    const cat = await client.query("SELECT * FROM categories");
    console.log("Categories:", cat.rows.map(c => ({ name: c.name, slug: c.slug, id: c.id })));

    await client.end();
}
check();
