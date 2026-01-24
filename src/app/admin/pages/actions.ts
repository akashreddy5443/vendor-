'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPage(formData: FormData) {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const is_published = formData.get('is_published') === 'on'

    const supabase = await createClient()

    const { error } = await supabase
        .from('pages')
        .insert({ title, slug, content, is_published })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/pages')
    redirect('/admin/pages')
}

export async function updatePage(id: string, formData: FormData) {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const is_published = formData.get('is_published') === 'on'

    const supabase = await createClient()

    const { error } = await supabase
        .from('pages')
        .update({ title, slug, content, is_published, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/pages')
    revalidatePath(`/pages/${slug}`) // Revalidate the public page
    redirect('/admin/pages')
}

export async function deletePage(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/pages')
    return { success: true }
}
