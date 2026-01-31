'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateHero(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const imageUrl = formData.get('imageUrl') as string

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
        content_json: { imageUrl },
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
        title: 'FEATURED GEAR',
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

    // Find section with type 'categories'.
    const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('section_type', 'categories')
        .single()

    const payload = {
        section_type: 'categories',
        title: 'SHOP BY CATEGORY',
        content_json: { categories },
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
        console.error('Error updating categories:', error)
        return { error: 'Failed to update categories' }
    }

    revalidatePath('/admin/homepage')
    revalidatePath('/', 'layout')
}

export async function updateFooter(formData: FormData) {
    const supabase = await createClient()

    const fullConfigStr = formData.get('fullConfig') as string
    let content_json: any = {}

    if (fullConfigStr) {
        content_json = JSON.parse(fullConfigStr)
    } else {
        // Fallback for legacy calls
        const copyrightText = formData.get('copyrightText') as string
        const creditsText = formData.get('creditsText') as string
        content_json = { copyrightText, creditsText }
    }

    // Find section with type 'footer'.
    const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('section_type', 'footer')
        .single()

    const payload = {
        section_type: 'footer',
        title: 'Footer',
        content_json,
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
        console.error('Error updating footer:', error)
        return { error: 'Failed to update footer' }
    }

    revalidatePath('/admin/homepage')
    revalidatePath('/')
}

export async function updateHeroSlider(formData: FormData) {
    const supabase = await createClient()

    const slidesStr = formData.get('slides') as string
    const slides = JSON.parse(slidesStr)

    // Find section with type 'hero_slider'.
    const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('section_type', 'hero_slider')
        .single()

    const payload = {
        section_type: 'hero_slider',
        title: 'Hero Slider',
        content_json: { slides },
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
        console.error('Error updating hero slider:', error)
        return { error: 'Failed to update user slider' }
    }

    revalidatePath('/admin/homepage')
    revalidatePath('/', 'layout')
}

export async function updateLifestyle(formData: FormData) {
    const supabase = await createClient()

    const items = JSON.parse(formData.get('items') as string)
    const subtitle = formData.get('subtitle') as string || 'Collections curated for modern creators'
    const title = formData.get('title') as string || 'Designed For Every Moment'

    const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('section_type', 'lifestyle_grid')
        .single()

    const payload = {
        section_type: 'lifestyle_grid',
        title,
        subtitle,
        content_json: { items },
        is_active: true,
    }

    if (existing) {
        await supabase.from('homepage_sections').update(payload).eq('id', existing.id)
    } else {
        await supabase.from('homepage_sections').insert(payload)
    }

    revalidatePath('/admin/homepage')
    revalidatePath('/', 'layout')
}

export async function updateTrending(formData: FormData) {
    const supabase = await createClient()

    const data = JSON.parse(formData.get('data') as string)

    const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('section_type', 'trending_spotlight')
        .single()

    const payload = {
        section_type: 'trending_spotlight',
        title: 'In The Spotlight',
        content_json: data,
        is_active: true,
    }

    if (existing) {
        await supabase.from('homepage_sections').update(payload).eq('id', existing.id)
    } else {
        await supabase.from('homepage_sections').insert(payload)
    }

    revalidatePath('/admin/homepage')
    revalidatePath('/', 'layout')
}

export async function updatePromoGrid(formData: FormData) {
    const supabase = await createClient()

    const cards = JSON.parse(formData.get('cards') as string)

    const { data: existing } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('section_type', 'promo_grid')
        .single()

    const payload = {
        section_type: 'promo_grid',
        title: 'Promo Banners',
        content_json: { cards },
        is_active: true,
    }

    if (existing) {
        await supabase.from('homepage_sections').update(payload).eq('id', existing.id)
    } else {
        await supabase.from('homepage_sections').insert(payload)
    }

    revalidatePath('/admin/homepage')
    revalidatePath('/', 'layout')
}
