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

async function test() {
    try {
        await client.connect();
        console.log("Testing Category Insert...");
        const res = await client.query("INSERT INTO categories (name, slug, description) VALUES ('TestCatUnique', 'test-unique', 'D') RETURNING id");
        console.log("Success:", res.rows[0].id);
    } catch (e) {
        console.error("FAIL:", e);
    } finally {
        await client.end();
    }
}
test();
