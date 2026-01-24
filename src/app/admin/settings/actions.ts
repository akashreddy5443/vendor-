'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
    const supabase = await createClient()

    const site_name = formData.get('site_name') as string
    const description = formData.get('description') as string
    const contact_email = formData.get('contact_email') as string
    const maintenance_mode = formData.get('maintenance_mode') === 'on'

    const { error } = await supabase
        .from('site_settings')
        .update({
            site_name,
            description,
            contact_email,
            maintenance_mode,
            updated_at: new Date().toISOString()
        })
        .eq('id', 1)

    if (error) {
        console.error('Error updating settings:', error)
        return { error: 'Failed to update settings' }
    }

    revalidatePath('/', 'layout') // Revalidate everything
    return { success: 'Settings updated successfully' }
}
