// Create a new admin user with known credentials
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function createNewAdmin() {
    console.log('🔧 Creating new admin user...\n')

    const newAdminEmail = 'admin@localhost.com'
    const newAdminPassword = 'Admin@123456'

    try {
        // 1. Create auth user
        console.log('📧 Creating authentication user...')
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: newAdminEmail,
            password: newAdminPassword,
            options: {
                data: {
                    name: 'Admin User'
                }
            }
        })

        if (authError) {
            if (authError.message.includes('already registered')) {
                console.log('⚠️  User already exists, trying to sign in...')

                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: newAdminEmail,
                    password: newAdminPassword
                })

                if (signInError) {
                    console.log('❌ Sign in failed:', signInError.message)
                    console.log('\n💡 Try these credentials at /login:')
                    console.log('   Email:', newAdminEmail)
                    console.log('   Password:', newAdminPassword)
                    return
                }

                console.log('✅ Successfully signed in!')
                console.log('\n🎉 Use these credentials:')
                console.log('   Email:', newAdminEmail)
                console.log('   Password:', newAdminPassword)
                return
            }

            console.error('❌ Auth error:', authError.message)
            return
        }

        console.log('✅ Auth user created!')
        console.log('   User ID:', authData.user?.id)

        // 2. Add to users table with admin role
        if (authData.user) {
            console.log('\n👤 Adding user to users table...')
            const { error: dbError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    email: newAdminEmail,
                    name: 'Admin User',
                    role: 'admin'
                })

            if (dbError) {
                if (dbError.message.includes('duplicate')) {
                    console.log('⚠️  User already in database')
                } else {
                    console.error('❌ Database error:', dbError.message)
                }
            } else {
                console.log('✅ User added to database with admin role!')
            }
        }

        console.log('\n' + '='.repeat(60))
        console.log('🎉 SUCCESS! New admin user created!')
        console.log('='.repeat(60))
        console.log('Email:', newAdminEmail)
        console.log('Password:', newAdminPassword)
        console.log('\nGo to http://localhost:3000/login and use these credentials')
        console.log('='.repeat(60))

    } catch (error) {
        console.error('❌ Unexpected error:', error.message)
    }
}

createNewAdmin()
