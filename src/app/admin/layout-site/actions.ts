'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAnnouncementBar(formData: FormData) {
    const supabase = await createClient()

    const text = formData.get('text') as string
    const link = formData.get('link') as string
    const show = formData.get('show') === 'on'

    const content = {
        text,
        link,
        show
    }

    // robustness: delete existing to avoid duplicate issues if unique constraint is missing
    await supabase.from('homepage_sections').delete().eq('section_type', 'announcement')

    const { error } = await supabase
        .from('homepage_sections')
        .insert({
            section_type: 'announcement',
            title: 'Announcement Bar',
            content_json: content,
            is_active: show
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function updateFooter(data: any) {
    const supabase = await createClient()

    // robustness: delete existing to avoid duplicate issues
    await supabase.from('homepage_sections').delete().eq('section_type', 'footer')

    const { error } = await supabase
        .from('homepage_sections')
        .insert({
            section_type: 'footer',
            title: 'Footer Configuration',
            content_json: data,
            is_active: true
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
