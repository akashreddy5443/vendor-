const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('SERVICE_ROLE_KEY_PRESENT');
} else {
    console.log('SERVICE_ROLE_KEY_MISSING');
}
