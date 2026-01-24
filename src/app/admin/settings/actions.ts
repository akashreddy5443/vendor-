'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
    const supabase = await createClient()

    const site_name = formData.get('site_name') as string
    const maintenance_mode = formData.get('maintenance_mode') === 'on'

    // Upsert settings for ID 1 (Singleton)
    const { error } = await supabase
        .from('site_settings')
        .upsert({
            id: 1,
            site_name,
            maintenance_mode,
        })

    if (error) {
        console.error('Error updating settings:', error)
        return { error: 'Failed to update settings' }
    }

    revalidatePath('/admin/settings')
    revalidatePath('/', 'layout') // Revalidate global layout to reflect site name change
}
