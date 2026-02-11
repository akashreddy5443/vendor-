'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const icon = formData.get('icon') as string
    const image_url = formData.get('image_url') as string
    const icon_bg_color = formData.get('icon_bg_color') as string
    const icon_color = formData.get('icon_color') as string
    const custom_icon_url = formData.get('custom_icon_url') as string
    // Simple slug generator: lowercase, spaces to dashes, remove special chars
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    const { error } = await supabase
        .from('categories')
        .insert({
            name,
            slug,
            icon: icon || '📦', // Default icon if none provided
            image_url: image_url || null,
            icon_bg_color: icon_bg_color || '#F3F4F6',
            icon_color: icon_color || '#6B7280',
            custom_icon_url: custom_icon_url || null,
        })

    if (error) {
        console.error('Error creating category:', error)
        throw new Error('Failed to create category')
    }

    // Revalidate both admin and frontend pages
    revalidatePath('/admin/categories')
    revalidatePath('/', 'layout') // Revalidate entire site to update Navbar
    redirect('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
    console.log('=== UPDATE CATEGORY START ===')
    console.log('ID:', id)

    const supabase = await createClient()

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const icon = formData.get('icon') as string
    const image_url = formData.get('image_url') as string

    console.log('Data:', { name, slug, icon, image_url })

    const { data, error } = await supabase
        .from('categories')
        .update({
            name,
            slug,
            icon,
            image_url,
        })
        .eq('id', id)
        .select()

    if (error) {
        console.error('Database error:', error)
        throw new Error(`Database error: ${error.message}`)
    }

    console.log('Update successful:', data)
    console.log('=== UPDATE CATEGORY END ===')

    // Return success without revalidation for now
    return { success: true }
}

export async function deleteCategory(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
        console.error('Error deleting category:', error)
        throw new Error('Failed to delete category')
    }

    // Revalidate both admin and frontend pages
    revalidatePath('/admin/categories')
    revalidatePath('/', 'layout')
}
