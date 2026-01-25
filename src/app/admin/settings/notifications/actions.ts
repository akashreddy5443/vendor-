'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateNotificationSetting(key: string, data: { label?: string; description?: string; is_active?: boolean }) {
    const supabase = await createClient()

    try {
        const updateData: any = {}
        if (data.label !== undefined) updateData.label = data.label
        if (data.description !== undefined) updateData.description = data.description
        if (data.is_active !== undefined) updateData.is_active = data.is_active

        const { error } = await supabase
            .from('notification_settings')
            .update(updateData)
            .eq('key', key)

        if (error) {
            console.error('Error updating notification setting:', error)
            return { error: 'Failed to update setting' }
        }

        revalidatePath('/admin/settings/notifications')
        revalidatePath('/user/settings') // Revalidate user settings as they use this data
        return { success: true }
    } catch (e) {
        console.error('Unexpected error:', e)
        return { error: 'An unexpected error occurred' }
    }
}

export async function updateNotificationTemplate(key: string, data: { subject?: string; body_content?: string }) {
    const supabase = await createClient()

    try {
        const updateData: any = {}
        if (data.subject !== undefined) updateData.subject = data.subject
        if (data.body_content !== undefined) updateData.body_content = data.body_content

        const { error } = await supabase
            .from('notification_templates')
            .update(updateData)
            .eq('template_key', key)

        if (error) {
            console.error('Error updating template:', error)
            return { error: 'Failed to update template' }
        }

        revalidatePath('/admin/settings/notifications')
        return { success: true }
    } catch (e) {
        console.error('Unexpected error:', e)
        return { error: 'An unexpected error occurred' }
    }
}
