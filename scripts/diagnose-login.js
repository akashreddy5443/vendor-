const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkLogin() {
    const email = 'test.user.vendor@gmail.com';
    const password = 'User123!';

    console.log(`Attempting to sign in with: ${email}`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login Failed!');
        console.error('Error Message:', error.message);
        console.error('Error Status:', error.status);
    } else {
        console.log('Login Successful!');
        console.log('User ID:', data.user.id);
        console.log('Session active.');
    }
}

checkLogin();
