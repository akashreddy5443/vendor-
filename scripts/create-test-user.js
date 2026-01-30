const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Error: Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createTestUser() {
    const email = 'test.user.vendor@gmail.com';
    const password = 'User123!';

    console.log(`Attempting to create user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Test User',
                role: 'user', // Explicitly setting 'user' role just in case
            },
        },
    });

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('User created successfully!');
        console.log('User ID:', data.user?.id);
        console.log('Please check your email for verification if enabled, or check the users table.');
        console.log(`Credentials:\nEmail: ${email}\nPassword: ${password}`);
    }
}

createTestUser();
