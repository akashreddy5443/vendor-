'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const icon = formData.get('icon') as string
    const image_url = formData.get('image_url') as string
    // Simple slug generator: lowercase, spaces to dashes, remove special chars
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    const { error } = await supabase
        .from('categories')
        .insert({
            name,
            slug,
            icon: icon || '📦', // Default icon if none provided
            image_url: image_url || null,
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
    try {
        const supabase = await createClient()

        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const icon = formData.get('icon') as string
        const image_url = formData.get('image_url') as string

        console.log('Updating category:', { id, name, slug, icon, image_url })

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
            console.error('Error updating category:', error)
            console.error('Error details:', JSON.stringify(error, null, 2))
            throw new Error(`Failed to update category: ${error.message}`)
        }

        console.log('Category updated successfully:', data)

        // Revalidate both admin and frontend pages
        revalidatePath('/admin/categories')
        revalidatePath('/', 'layout') // Revalidate entire site to update Navbar

        // Don't redirect here - let the client component handle it
        return { success: true, data }
    } catch (error: any) {
        console.error('Unexpected error in updateCategory:', error)
        throw error
    }
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
