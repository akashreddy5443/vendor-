require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

let connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  console.error('No connection string');
  process.exit(1);
}

// Remove sslmode from query if present to allow manual config
connectionString = connectionString.replace('sslmode=require', '');

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // Critical for avoiding self-signed errors
  }
});

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected to DB');

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
            "subtitle": "FLAT 10% OFF",
            "description": "Pre-order Vision AR today. Includes pro case.",
            "icon": "Gamepad",
            "href": "/products?category=monitors",
            "delay": 0.4,
            "color": "bg-slate-50 border-slate-100"
          }
        ]
      }'
      WHERE section_type = 'promo_grid';
    `;

    const res = await client.query(sql);
    console.log(`✅ Update success! Rows affected: ${res.rowCount}`);

    // Validate
    const check = await client.query("SELECT content_json FROM homepage_sections WHERE section_type = 'promo_grid'");
    console.log('Current Data Snippet:', JSON.stringify(check.rows[0]?.content_json).slice(0, 100));

  } catch (e) {
    console.error('❌ Error:', e);
  } finally {
    await client.end();
  }
}

run();
