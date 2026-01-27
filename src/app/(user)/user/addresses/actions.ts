'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAddress(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const fullName = formData.get('fullName') as string
    const street = formData.get('street') as string
    const city = formData.get('city') as string
    const postalCode = formData.get('zip') as string
    const state = formData.get('state') as string

    // Simple validation
    if (!street || !city || !postalCode) return

    const { error } = await supabase
        .from('addresses')
        .insert({
            user_id: user.id,
            full_name: fullName || 'Home',
            street_address: street,
            city,
            postal_code: postalCode,
            state,
            country: 'India', // Default for now
            is_default: false
        })

    if (error) {
        console.error('Error adding address:', error)
    }

    revalidatePath('/user/addresses')
}

export async function deleteAddress(addressId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id) // Security: Ensure ownership

    revalidatePath('/user/addresses')
}
