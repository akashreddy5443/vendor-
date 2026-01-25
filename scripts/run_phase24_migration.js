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

async function applyMigration() {
    try {
        await client.connect();
        console.log('Connected to DB...');

        const sqlPath = path.resolve(__dirname, '../migrations/phase24_notifications.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await client.query(sql);
        console.log('✅ Phase 24 Notification Tables Created.');
    } catch (err) {
        console.error('❌ Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

applyMigration();
