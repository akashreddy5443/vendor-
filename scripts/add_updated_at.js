const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function fixSchema() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
    if (!connectionString) {
        console.error('No connection string found');
        return;
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();

        console.log('Adding updated_at column to orders table...');
        await client.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
        `);
        console.log('Column added successfully.');

        // Optional: Add trigger to auto-update updated_at
        await client.query(`
            CREATE OR REPLACE FUNCTION update_modified_column() 
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW; 
            END;
            $$ language 'plpgsql';

            DROP TRIGGER IF EXISTS update_orders_modtime ON orders;
            
            CREATE TRIGGER update_orders_modtime 
            BEFORE UPDATE ON orders 
            FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
        `);
        console.log('Trigger added successfully.');

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

fixSchema();
