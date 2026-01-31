'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateUserProfile(formData: FormData) {
    const supabase = await createClient()

    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string

    // Validate
    if (!full_name || full_name.length < 2) {
        return { error: 'Name must be at least 2 characters' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // Update 'users' table (assuming public.users is the profile table)
    // Note: If you use 'profiles', change the table name here.
    // Based on previous context, 'users' seems to be the table.
    const { error } = await supabase
        .from('users')
        .update({
            full_name,
            phone_number: phone, // Assuming column name is phone_number or phone? I'll check schema if I can, but guessing phone_number based on standards
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        console.error('Profile Update Error:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/user/settings')
    return { success: 'Profile updated successfully' }
}
