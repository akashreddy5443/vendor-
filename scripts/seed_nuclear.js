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
console.log("Connecting...");
const client = new Client({ connectionString });

const escapeLiteral = (str) => "'" + str.replace(/'/g, "''") + "'";

async function seed() {
    try {
        await client.connect();

        console.log("Disable RLS...");
        await client.query("ALTER TABLE products DISABLE ROW LEVEL SECURITY");
        await client.query("ALTER TABLE categories DISABLE ROW LEVEL SECURITY");
        await client.query("ALTER TABLE product_images DISABLE ROW LEVEL SECURITY");

        console.log("Cleaning...");
        await client.query("DELETE FROM product_images");
        await client.query("DELETE FROM products");
        await client.query("DELETE FROM categories");

        console.log("Seeding Categories...");
        const cats = [
            { name: 'Laptops', slug: 'laptops' },
            { name: 'Phones', slug: 'phones' },
            { name: 'Audio', slug: 'audio' },
            { name: 'Accessories', slug: 'accessories' }
        ];

        const catMap = {};
        for (const c of cats) {
            const res = await client.query(`INSERT INTO categories (name, slug, description) VALUES ('${c.name}', '${c.slug}', 'Desc') RETURNING id`);
            catMap[c.name] = res.rows[0].id;
        }

        console.log("Seeding Products...");
        const products = [
            { title: 'MacBook Pro', slug: 'macbook-pro', price: 200000, stock: 10, category: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8' },
            { title: 'Dell XPS', slug: 'dell-xps', price: 150000, stock: 10, category: 'Laptops', image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6' },
            { title: 'Pixel 8', slug: 'pixel-8', price: 80000, stock: 20, category: 'Phones', image: 'https://images.unsplash.com/photo-1696446702305-64906bf38b16' },
            { title: 'iPhone 15', slug: 'iphone-15', price: 90000, stock: 20, category: 'Phones', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569' },
            { title: 'Shure Mic', slug: 'shure-mic', price: 40000, stock: 15, category: 'Audio', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc' },
            { title: 'Sony Headphones', slug: 'sony-xm5', price: 30000, stock: 15, category: 'Audio', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb' },
            { title: 'Keychron Keyboard', slug: 'keychron', price: 15000, stock: 10, category: 'Accessories', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212' },
            { title: 'Logitech Mouse', slug: 'logitech-mx', price: 10000, stock: 50, category: 'Accessories', image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3' },
            { title: 'LG Monitor', slug: 'lg-monitor', price: 40000, stock: 10, category: 'Accessories', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf' },
            { title: 'Webcam', slug: 'webcam', price: 5000, stock: 30, category: 'Accessories', image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3' }
        ];

        const insertedIds = [];
        for (const p of products) {
            const catId = catMap[p.category];
            const sql = `INSERT INTO products (title, slug, description, price, stock, status, category_id) VALUES ('${p.title}', '${p.slug}', 'Desc', ${p.price}, ${p.stock}, 'active', '${catId}') RETURNING id`;
            const res = await client.query(sql);
            const pid = res.rows[0].id;
            insertedIds.push(pid);

            await client.query(`INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary) VALUES ('${pid}', '${p.image}', 'image', true)`);
        }

        console.log("Seeding Featured...");
        const feat = JSON.stringify({ productIds: insertedIds.slice(0, 3) });
        await client.query(`INSERT INTO homepage_sections (section_type, title, subtitle, content_json, is_active) VALUES ('featured', 'Featured', 'Desc', '${feat}', true) ON CONFLICT (section_type) DO UPDATE SET content_json = '${feat}'`);

        console.log("Re-enable RLS...");
        await client.query("ALTER TABLE products ENABLE ROW LEVEL SECURITY");
        await client.query("ALTER TABLE categories ENABLE ROW LEVEL SECURITY");
        await client.query("ALTER TABLE product_images ENABLE ROW LEVEL SECURITY");

        console.log("Add Full Policies...");
        // Ensure policies exist for public read
        await client.query(`
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public products are viewable by everyone') THEN
                    CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
                END IF;
                 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public categories are viewable by everyone') THEN
                    CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
                END IF;
                 IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public product images are viewable by everyone') THEN
                    CREATE POLICY "Public product images are viewable by everyone" ON product_images FOR SELECT USING (true);
                END IF;
            END $$;
        `);

        console.log("✅ NUCLEAR SEED COMPLETE.");

    } catch (e) {
        console.error("Fail:", e);
    } finally {
        await client.end();
    }
}
seed();
