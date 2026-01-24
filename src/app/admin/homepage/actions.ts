'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateHero(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const imageUrl = formData.get('imageUrl') as string

    // Upsert Hero Section (Assuming we fix it to a specific ID or Section Type)
    // For simplicity, we'll assume there's one hero row.
    // Actually, schema has 'section_type'. Let's check if one exists, else insert.

    // We'll use a transaction or just simple logic:
    // Find section with type 'hero'.
    const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('section_type', 'hero')
        .single()

    const payload = {
        section_type: 'hero',
        title,
        subtitle,
        content_json: { imageUrl }, // Storing image in the JSON blob
        is_active: true,
    }

    let error;
    if (existing) {
        const { error: updateError } = await supabase
            .from('homepage_sections')
            .update(payload)
            .eq('id', existing.id)
        error = updateError
    } else {
        const { error: insertError } = await supabase
            .from('homepage_sections')
            .insert(payload)
        error = insertError
    }

    if (error) {
        console.error('Error updating hero:', error)
        return { error: 'Failed to update hero section' }
    }

    revalidatePath('/admin/homepage')
    revalidatePath('/', 'layout')
}
