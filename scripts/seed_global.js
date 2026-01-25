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

async function seedGlobal() {
    try {
        await client.connect();

        console.log("Cleaning up old test data...");
        await client.query("DELETE FROM product_images");
        await client.query("DELETE FROM products");
        // Don't delete categories to avoid foreign key issues with other tables if any, valid check

        // 1. Categories
        const categories = [
            { name: 'Laptops', slug: 'laptops' },
            { name: 'Phones', slug: 'phones' },
            { name: 'Audio', slug: 'audio' },
            { name: 'Accessories', slug: 'accessories' }
        ];

        const catMap = {};

        for (const c of categories) {
            let res = await client.query('SELECT id FROM categories WHERE slug = $1', [c.slug]);
            if (res.rows.length === 0) {
                console.log(`Creating category: ${c.name}`);
                res = await client.query("INSERT INTO categories (name, slug, description) VALUES ($1, $2, 'Default desc') RETURNING id", [c.name, c.slug]);
            }
            catMap[c.name] = res.rows[0].id;
        }

        // 2. Products
        const products = [
            {
                title: 'ProDev MacBook Pro 16',
                slug: 'prodev-macbook-pro-16',
                description: 'The ultimate machine for developers. M3 Max chip, 32GB RAM, 1TB SSD. Crushes compile times.',
                price: 249900,
                stock: 50,
                category: 'Laptops',
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Dell XPS 15 Developer Edition',
                slug: 'dell-xps-15',
                description: 'Premium Windows laptop with 4K OLED display and Ubuntu pre-installed. Perfect for Linux enthusiasts.',
                price: 185000,
                stock: 30,
                category: 'Laptops',
                image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Pixel 8 Pro',
                slug: 'pixel-8-pro',
                description: 'Google designed phone built for AI. Best in class camera and stock Android experience.',
                price: 105999,
                stock: 100,
                category: 'Phones',
                image: 'https://images.unsplash.com/photo-1696446702305-64906bf38b16?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'iPhone 15 Pro Max',
                slug: 'iphone-15-pro-max',
                description: 'Titanium design, powerful A17 Pro chip, and USB-C. The standard for mobile development testing.',
                price: 159900,
                stock: 100,
                category: 'Phones',
                image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Shure SM7B Vocal Microphone',
                slug: 'shure-sm7b',
                description: 'Legendary dynamic microphone for broadcasting, podcasting, and recording. Crystal clear audio.',
                price: 35000,
                stock: 40,
                category: 'Audio',
                image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'HyperX QuadCast S',
                slug: 'hyperx-quadcast-s',
                description: 'USB condenser microphone with RGB lighting. Easy setup for streaming and meetings.',
                price: 15490,
                stock: 60,
                category: 'Audio',
                image: 'https://images.unsplash.com/photo-1583597573809-5c4aa3e69f82?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Sony WH-1000XM5',
                slug: 'sony-wh-1000xm5',
                description: 'Industry-leading noise canceling headphones. Focus on your code without distractions.',
                price: 29990,
                stock: 80,
                category: 'Audio',
                image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Keychron Q1 Pro Wireless',
                slug: 'keychron-q1-pro',
                description: 'Custom mechanical keyboard with QMK/VIA support. Aluminum body and premium typing feel.',
                price: 19999,
                stock: 45,
                category: 'Accessories',
                image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'Logitech MX Master 3S',
                slug: 'mx-master-3s',
                description: 'The productivity mouse. Quiet clicks, fast scrolling, and ergonomic design.',
                price: 9995,
                stock: 120,
                category: 'Accessories',
                image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&q=80&w=1000'
            },
            {
                title: 'LG UltraGear 27" 4K',
                slug: 'lg-ultragear-4k',
                description: '144Hz IPS panel with G-Sync. Crisp text and smooth motion for coding and gaming.',
                price: 45000,
                stock: 25,
                category: 'Accessories',
                image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000'
            }
        ];

        const insertedIds = [];

        for (const p of products) {
            const catId = catMap[p.category];
            if (!catId) continue;

            const pRes = await client.query(`
                INSERT INTO products (title, slug, description, price, stock, status, category_id)
                VALUES ($1, $2, $3, $4, $5, 'active', $6)
                RETURNING id;
            `, [p.title, p.slug, p.description, p.price, p.stock, catId]);

            const prodId = pRes.rows[0].id;
            insertedIds.push(prodId);

            await client.query(`
                INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
                VALUES ($1, $2, 'image', true);
            `, [prodId, p.image]);

            console.log(`Inserted: ${p.title}`);
        }

        // 3. Featured Section
        if (insertedIds.length >= 3) {
            const featIds = insertedIds.slice(0, 3);
            const contentJson = JSON.stringify({ productIds: featIds });

            await client.query(`
                INSERT INTO homepage_sections (section_type, title, subtitle, content_json, is_active)
                VALUES ('featured', 'Featured Gear', 'Our top picks for this week.', $1, true)
                ON CONFLICT (section_type) 
                DO UPDATE SET content_json = $1, is_active = true;
            `, [contentJson]);
            console.log('✅ Updated Featured Section.');
        }

    } catch (e) {
        console.error("Critical Error:", e);
    } finally {
        await client.end();
    }
}

seedGlobal();
