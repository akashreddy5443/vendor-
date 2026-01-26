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

export async function updateFeatured(formData: FormData) {
    const supabase = await createClient()

    const productIds = JSON.parse(formData.get('productIds') as string)

    // Find section with type 'featured'.
    const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('section_type', 'featured')
        .single()

    const payload = {
        section_type: 'featured',
        title: 'FEATURED GEAR', // Default title, could be made editable
        content_json: { productIds },
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
        console.error('Error updating featured section:', error)
        return { error: 'Failed to update featured section' }
    }

    revalidatePath('/admin/homepage')
    revalidatePath('/', 'layout')
}

export async function updateCategories(formData: FormData) {
    const supabase = await createClient()

    const categories = JSON.parse(formData.get('categories') as string)

    // Check for existing section(s)
    const { data: existingSections } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('section_type', 'categories')

    const payload = {
        section_type: 'categories',
        title: 'Shop by Category',
        content_json: { categories },
        is_active: true,
    }

    let error;

    // If one or more exist, update the first one
    if (existingSections && existingSections.length > 0) {
        const targetId = existingSections[0].id
        const { error: updateError } = await supabase
            .from('homepage_sections')
            .update(payload)
            .eq('id', targetId)
        error = updateError

        // Optional: Clean up duplicates if any
        if (existingSections.length > 1) {
            const duplicates = existingSections.slice(1).map(s => s.id)
            await supabase.from('homepage_sections').delete().in('id', duplicates)
        }
    } else {
        // If none exist, insert new
        const { error: insertError } = await supabase
            .from('homepage_sections')
            .insert(payload)
        error = insertError
    }

    if (error) {
        console.error('Error updating categories:', error)
        return { error: 'Failed to update categories' }
    }

    revalidatePath('/admin/homepage')
    revalidatePath('/', 'layout')
}
