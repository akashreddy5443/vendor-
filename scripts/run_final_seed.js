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
console.log("Connect:", connectionString.substring(0, 15));
const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();
        const sql = fs.readFileSync(path.resolve(__dirname, '../migrations/final_seed_dump.sql'), 'utf8');
        console.log("Running SQL...");
        await client.query(sql);
        console.log("✅ SQL EXECUTION SUCCESS.");
    } catch (e) {
        console.error("SQL Fail:", e);
    } finally {
        await client.end();
    }
}
run();
