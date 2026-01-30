'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const avatarUrl = formData.get('avatarUrl') as string

    const { error } = await supabase
        .from('users')
        .update({
            full_name: fullName,
            phone_number: phone,
            avatar_url: avatarUrl
            // Email updates usually require re-verification flow, skipping for simple profile edit
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/user/settings')
    revalidatePath('/user')
    return { success: true }
}
