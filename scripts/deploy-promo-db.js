require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
    console.error('No POSTGRES connection string found in .env.local');
    process.exit(1);
}

const client = new Client({
    connectionString: connectionString,
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to Database');

        const sql = `
      UPDATE homepage_sections
      SET content_json = '{
        "cards": [
          {
            "id": "promo-1",
            "title": "Launch Offer",
            "subtitle": "Flat 15% OFF",
            "description": "On the new Quantum X1 Flagship. Limited units.",
            "icon": "Zap",
            "href": "/products?category=laptops",
            "delay": 0.1,
            "color": "bg-slate-50 border-slate-100"
          },
          {
            "id": "promo-2",
            "title": "Studio Deal",
            "subtitle": "Save ₹5,000",
            "description": "Pro-grade noise cancellation. Ends tonight.",
            "icon": "Headphones",
            "href": "/products?category=audio",
            "delay": 0.2,
            "color": "bg-white border-slate-100"
          },
          {
            "id": "promo-3",
            "title": "Bundle Save",
            "subtitle": "Get 20% OFF",
            "description": "When you buy EcoHub with any sensor.",
            "icon": "ShieldCheck",
            "href": "/products?category=accessories",
            "delay": 0.3,
            "color": "bg-white border-slate-100"
          },
          {
            "id": "promo-4",
            "title": "Early Bird",
            "subtitle": "Free Shipping",
            "description": "Pre-order Vision AR today. No hidden fees.",
            "icon": "Camera",
            "href": "/products?category=monitors",
            "delay": 0.4,
            "color": "bg-slate-50 border-slate-100"
          }
        ]
      }'
      WHERE section_type = 'promo_grid';
    `;

        const res = await client.query(sql);
        console.log(`Update success! Rows affected: ${res.rowCount}`);

        // Check if it exists
        if (res.rowCount === 0) {
            console.log("Row not found, inserting...");
            const insertSql = `
            INSERT INTO homepage_sections (section_type, content_json, is_active, display_order)
            VALUES ('promo_grid', '{
                "cards": [
                    {
                    "id": "promo-1",
                    "title": "Launch Offer",
                    "subtitle": "Flat 15% OFF",
                    "description": "On the new Quantum X1 Flagship. Limited units.",
                    "icon": "Zap",
                    "href": "/products?category=laptops",
                    "delay": 0.1,
                    "color": "bg-slate-50 border-slate-100"
                    },
                    {
                    "id": "promo-2",
                    "title": "Studio Deal",
                    "subtitle": "Save ₹5,000",
                    "description": "Pro-grade noise cancellation. Ends tonight.",
                    "icon": "Headphones",
                    "href": "/products?category=audio",
                    "delay": 0.2,
                    "color": "bg-white border-slate-100"
                    },
                    {
                    "id": "promo-3",
                    "title": "Bundle Save",
                    "subtitle": "Get 20% OFF",
                    "description": "When you buy EcoHub with any sensor.",
                    "icon": "ShieldCheck",
                    "href": "/products?category=accessories",
                    "delay": 0.3,
                    "color": "bg-white border-slate-100"
                    },
                    {
                    "id": "promo-4",
                    "title": "Early Bird",
                    "subtitle": "Free Shipping",
                    "description": "Pre-order Vision AR today. No hidden fees.",
                    "icon": "Camera",
                    "href": "/products?category=monitors",
                    "delay": 0.4,
                    "color": "bg-slate-50 border-slate-100"
                    }
                ]
            }', true, 3);
        `;
            await client.query(insertSql);
            console.log("Insert success!");
        }

    } catch (e) {
        console.error('Error executing query', e);
    } finally {
        await client.end();
    }
}

run();
