import { CategoryEditor } from '@/components/admin/CategoryEditor'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (!category) {
        redirect('/admin/categories')
    }

    return <CategoryEditor category={category} />
}
