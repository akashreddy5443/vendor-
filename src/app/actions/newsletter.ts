'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email is required' }
    }

    const supabase = await createClient()

    // Check if already subscribed
    const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email)
        .single()

    if (existing) {
        return { message: 'Already subscribed!' }
    }

    const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email })

    if (error) {
        return { error: 'Failed to subscribe. Please try again.' }
    }

    // Optional: Revalidate admin subscribers page if we were statically rendering it (unlikely for admin)
    revalidatePath('/admin/subscribers')

    return { success: true, message: 'Successfully subscribed!' }
}
