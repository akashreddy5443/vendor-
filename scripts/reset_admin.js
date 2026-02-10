// Reset admin user and password
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function resetAdmin() {
    console.log('🔧 Resetting admin user...\n')

    const adminEmail = 'akashreddy5443123@gmail.com'
    const newPassword = 'admin123456' // Change this to your preferred password

    try {
        // First, check if user exists in auth.users
        console.log('📧 Checking for existing admin user...')

        // Try to sign in with a dummy password to check if user exists
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: 'dummy_password_to_check'
        })

        if (signInError && signInError.message.includes('Invalid login credentials')) {
            console.log('✅ User exists but password is wrong')
            console.log('\n⚠️  To reset password, you need to:')
            console.log('1. Go to Supabase Dashboard → Authentication → Users')
            console.log('2. Find user: ' + adminEmail)
            console.log('3. Click "..." menu → "Reset Password"')
            console.log('4. Or use Supabase Admin API (requires service role key)')
            console.log('\n💡 Alternative: Create a new admin user with this script')
        } else if (signInError && signInError.message.includes('Email not confirmed')) {
            console.log('⚠️  User exists but email not confirmed')
            console.log('Check your email for confirmation link')
        } else if (!signInError) {
            console.log('✅ Successfully signed in! Your password is correct.')
            console.log('Try logging in again at /login')
        }

        // Check users table
        console.log('\n📊 Checking users table...')
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .eq('email', adminEmail)

        if (usersError) {
            console.error('❌ Error checking users table:', usersError.message)
        } else if (users && users.length > 0) {
            console.log('✅ User found in users table:')
            console.log('   ID:', users[0].id)
            console.log('   Email:', users[0].email)
            console.log('   Role:', users[0].role)
            console.log('   Name:', users[0].name)
        } else {
            console.log('⚠️  No user found in users table')
            console.log('   This might cause issues even if auth works')
        }

        console.log('\n' + '='.repeat(60))
        console.log('RECOMMENDED SOLUTION:')
        console.log('='.repeat(60))
        console.log('1. Go to: https://reokmwqcdzofbimdwcxp.supabase.co/auth/users')
        console.log('2. Find your admin user')
        console.log('3. Click "Send password recovery email"')
        console.log('4. Check your email and reset password')
        console.log('5. Or manually set a new password in the dashboard')
        console.log('='.repeat(60))

    } catch (error) {
        console.error('❌ Unexpected error:', error.message)
    }
}

resetAdmin()
