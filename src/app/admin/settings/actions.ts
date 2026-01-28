'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
    const supabase = await createClient()

    const site_name = formData.get('site_name') as string
    const description = formData.get('description') as string
    const contact_email = formData.get('contact_email') as string
    const maintenance_mode = formData.get('maintenance_mode') === 'on'
    const logo_url = formData.get('logo_url') as string
    const global_discount_percentage = parseFloat(formData.get('global_discount_percentage') as string || '0')
    const default_gst_percentage = parseFloat(formData.get('default_gst_percentage') as string || '18')

    const { error } = await supabase
        .from('site_settings')
        .upsert({
            id: 1,
            site_name,
            description,
            contact_email,
            maintenance_mode,
            logo_url,
            global_discount_percentage,
            default_gst_percentage,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

    if (error) {
        console.error('Error updating settings:', error)
        return { error: 'Failed to update settings' }
    }

    revalidatePath('/', 'layout') // Revalidate everything
    return { success: 'Settings updated successfully' }
}
