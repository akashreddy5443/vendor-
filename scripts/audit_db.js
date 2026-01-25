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

async function audit() {
    try {
        await client.connect();

        console.log("=== SCHEMA AUDIT ===");
        const tables = ['products', 'categories', 'wishlist', 'product_images'];
        for (const t of tables) {
            console.log(`\nTable: ${t}`);
            const res = await client.query(`
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = '${t}'
            `);
            res.rows.forEach(r => console.log(`  - ${r.column_name}: ${r.data_type} (${r.is_nullable})`));
        }

        console.log("\n=== RLS POLICIES ===");
        const pol = await client.query("SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename = ANY($1)", [tables]);
        pol.rows.forEach(r => console.log(`  - ${r.tablename}: ${r.policyname} (${r.cmd})`));

        console.log("\n=== DATA SAMPLE (Price) ===");
        const priceSample = await client.query("SELECT id, price FROM products LIMIT 3");
        console.log(priceSample.rows);

    } catch (e) {
        console.error("Audit Fail:", e);
    } finally {
        await client.end();
    }
}
audit();
