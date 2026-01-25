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

console.log("Connection String (Partial):", connectionString ? connectionString.substring(0, 15) + "..." : "NONE");

const client = new Client({ connectionString });

async function debug() {
    try {
        await client.connect();

        // Check Categories
        const cats = await client.query('SELECT count(*) FROM categories');
        console.log('Categories Count:', cats.rows[0].count);

        // Check Products
        const prods = await client.query('SELECT count(*) FROM products');
        console.log('Products Count:', prods.rows[0].count);

        if (parseInt(prods.rows[0].count) === 0) {
            console.log("Attempting force insert...");
            try {
                // Ensure category exists
                let catId;
                const catRes = await client.query("SELECT id FROM categories LIMIT 1");
                if (catRes.rows.length === 0) {
                    const newCat = await client.query("INSERT INTO categories (name, slug) VALUES ('TestCat', 'test-cat') RETURNING id");
                    catId = newCat.rows[0].id;
                } else {
                    catId = catRes.rows[0].id;
                }

                await client.query(`
                    INSERT INTO products (title, slug, description, price, stock, status, category_id)
                    VALUES ('Debug Product', 'debug-prod', 'Test', 100, 10, 'active', $1)
                `, [catId]);
                console.log("Force insert successful.");
            } catch (e) {
                console.error("Force insert failed:", e);
            }
        }

    } catch (err) {
        console.error('DB Error:', err);
    } finally {
        await client.end();
    }
}

debug();
