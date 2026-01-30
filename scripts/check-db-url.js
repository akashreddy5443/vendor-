const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Try loading from .env.local in project root
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    // try .env
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

console.log('Checking for Database Connection String...');
if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL is PRESENT.');
    if (process.env.DATABASE_URL.includes('127.0.0.1') || process.env.DATABASE_URL.includes('localhost')) {
        console.log('DATABASE_URL points to LOCALHOST.');
    } else {
        console.log('DATABASE_URL points to REMOTE.');
    }
} else if (process.env.POSTGRES_URL) {
    console.log('POSTGRES_URL is PRESENT.');
    if (process.env.POSTGRES_URL.includes('127.0.0.1') || process.env.POSTGRES_URL.includes('localhost')) {
        console.log('POSTGRES_URL points to LOCALHOST.');
    } else {
        console.log('POSTGRES_URL points to REMOTE.');
    }
} else {
    console.log('NO Connection String found (DATABASE_URL or POSTGRES_URL).');
}
