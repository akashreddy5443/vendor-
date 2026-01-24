'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addAddress(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const street = formData.get('street') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const zip = formData.get('zip') as string
    const country = formData.get('country') as string || 'India'
    const fullName = formData.get('fullName') as string || 'My Address'

    const { error } = await supabase.from('addresses').insert({
        user_id: user.id,
        full_name: fullName,
        street_address: street,
        city,
        state,
        postal_code: zip,
        country
    })

    if (error) return { error: error.message }

    revalidatePath('/user/addresses')
    return { success: true }
}

export async function deleteAddress(addressId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id)

    if (error) return { error: error.message }
    revalidatePath('/user/addresses')
    return { success: true }
}
