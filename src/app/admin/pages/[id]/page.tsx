import { createClient } from '@/lib/supabase/server'
import PageEditor from '@/components/admin/PageEditor' // Using the component we just made

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (id === 'new') {
        return <PageEditor />
    }

    const supabase = await createClient()
    const { data: page } = await supabase.from('pages').select('*').eq('id', id).single()

    return <PageEditor page={page} />
}
