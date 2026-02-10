// Test category update directly
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testUpdate() {
    console.log('Testing category update...\n')

    // Get first category
    const { data: categories, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .limit(1)

    if (fetchError) {
        console.error('❌ Fetch error:', fetchError)
        return
    }

    if (!categories || categories.length === 0) {
        console.log('No categories found')
        return
    }

    const category = categories[0]
    console.log('Found category:', category.name)
    console.log('Current icon:', category.icon)

    // Try to update it
    const { data, error } = await supabase
        .from('categories')
        .update({
            name: category.name // Just update with same name to test
        })
        .eq('id', category.id)
        .select()

    if (error) {
        console.error('❌ Update error:', error)
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
    } else {
        console.log('✅ Update successful!')
        console.log('Updated data:', data)
    }
}

testUpdate()
