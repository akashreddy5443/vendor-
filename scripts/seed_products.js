const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load env specific for connection string
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

if (!connectionString) {
    console.error("Critical: No DB Connection String found.");
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

const categories = [
    { name: 'Laptops', slug: 'laptops', description: 'High-performance machines for coding and creative work.' },
    { name: 'Phones', slug: 'phones', description: 'Latest smartphones for testing and daily use.' },
    { name: 'Audio', slug: 'audio', description: 'Premium microphones and headphones.' },
    { name: 'Accessories', slug: 'accessories', description: 'Keyboards, mice, and more.' }
];

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

async function applySeed() {
    try {
        await client.connect();
        console.log('Connected to DB...');

        const catIds = {};

        // 1. Categories
        for (const cat of categories) {
            // Check if exists
            const res = await client.query('SELECT id FROM categories WHERE name = $1', [cat.name]);
            if (res.rows.length > 0) {
                catIds[cat.name] = res.rows[0].id;
                console.log(`Category exists: ${cat.name}`);
            } else {
                // Insert
                try {
                    const insertRes = await client.query(
                        'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id',
                        [cat.name, cat.slug, cat.description]
                    );
                    catIds[cat.name] = insertRes.rows[0].id;
                    console.log(`Created category: ${cat.name}`);
                } catch (e) {
                    console.log(`Skipping category ${cat.name} due to error (likely exists but slug conflict):`, e.message);
                    // try fetching again if insert failed (maybe slug mismatch)
                    const retryRes = await client.query('SELECT id FROM categories WHERE name = $1', [cat.name]);
                    if (retryRes.rows.length > 0) catIds[cat.name] = retryRes.rows[0].id;
                }
            }
        }

        // 2. Products
        for (const p of products) {
            const catId = catIds[p.category];
            if (!catId) {
                console.warn(`Skipping product ${p.title}: Category ID not found for ${p.category}`);
                continue;
            }

            // Check if product exists (by slug)
            const checkRes = await client.query('SELECT id FROM products WHERE slug = $1', [p.slug]);

            if (checkRes.rows.length === 0) {
                const insertRes = await client.query(
                    `INSERT INTO products (title, slug, description, price, stock, status, category_id) 
                      VALUES ($1, $2, $3, $4, $5, $6, $7) 
                      RETURNING id`,
                    [p.title, p.slug, p.description, p.price, p.stock, 'active', catId]
                );
                const productId = insertRes.rows[0].id;

                // Insert Image
                await client.query(
                    `INSERT INTO product_images (product_id, cloudinary_url, media_type, is_primary)
                      VALUES ($1, $2, $3, $4)`,
                    [productId, p.image, 'image', true]
                );
                console.log(`Created product: ${p.title}`);
            } else {
                console.log(`Product already exists: ${p.title}`);
            }
        }

        console.log('✅ Successfully seeded products.');
    } catch (err) {
        console.error('❌ Error Seeding:', err);
    } finally {
        await client.end();
    }
}

applySeed();
