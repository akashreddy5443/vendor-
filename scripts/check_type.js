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

async function checkType() {
    await client.connect();
    const res = await client.query("SELECT table_name, table_type FROM information_schema.tables WHERE table_name = 'categories' OR table_name = 'products'");
    console.log(res.rows);
    await client.end();
}
checkType();
