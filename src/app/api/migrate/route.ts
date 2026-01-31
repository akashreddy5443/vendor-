import { NextResponse } from 'next/server';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function GET() {
    let client;
    try {
        console.log('Attempting migration via API...');

        const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
        if (!connectionString) {
            throw new Error('Database connection string not found in env vars');
        }

        client = new Client({
            connectionString: connectionString,
            ssl: { rejectUnauthorized: false }
        });

        await client.connect();
        console.log('Connected to DB');

        const migrationPath = path.join(process.cwd(), 'migrations', 'phase2_add_brand.sql');
        console.log('Reading migration from:', migrationPath);

        const sql = fs.readFileSync(migrationPath, 'utf8');
        console.log('SQL Length:', sql.length);

        await client.query(sql);
        console.log('Query executed');

        await client.end();

        return NextResponse.json({ success: true, message: 'Migration executed successfully' });
    } catch (error: any) {
        console.error('Migration error:', error);
        if (client) await client.end();
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
