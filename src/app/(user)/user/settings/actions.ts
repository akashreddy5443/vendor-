'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('fullName') as string

    if (!fullName) {
        return { error: 'Full Name is required' }
    }

    // Update public.users table
    const { error } = await supabase
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    // Also update auth metadata if you want, but local table is usually enough for app logic
    // await supabase.auth.updateUser({ data: { full_name: fullName } })

    revalidatePath('/user')
    revalidatePath('/user/settings')
    return { success: 'Profile updated successfully' }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }

    return { success: 'Password updated successfully' }
}
