'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const icon = formData.get('icon') as string
    // Simple slug generator: lowercase, spaces to dashes, remove special chars
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')

    const { error } = await supabase
        .from('categories')
        .insert({
            name,
            slug,
            icon: icon || '📦', // Default icon if none provided
        })

    if (error) {
        console.error('Error creating category:', error)
        // ideally return error to UI, simplify for now
        return { error: 'Failed to create category' }
    }

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const icon = formData.get('icon') as string

    const { error } = await supabase
        .from('categories')
        .update({
            name,
            slug,
            icon,
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating category:', error)
        return { error: 'Failed to update category' }
    }

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function deleteCategory(formData: FormData) {
    const supabase = await createClient()
    const id = formData.get('id') as string

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
        console.error('Error deleting category:', error)
        return { error: 'Failed to delete category' }
    }

    revalidatePath('/admin/categories')
}
