import { createClient } from '@/lib/supabase/server'
import LayoutBuilder from '@/components/admin/LayoutBuilder'

export default async function LayoutSitePage() {
    const supabase = await createClient()

    // Fetch Announcement Bar
    const { data: announcement } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'announcement')
        .single()

    // Fetch Footer
    const { data: footer } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'footer')
        .single()

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-serif mb-2 text-gray-900">Site Layout</h1>
                <p className="text-gray-500">Manage global elements like the announcement bar and footer.</p>
            </div>

            <LayoutBuilder announcement={announcement} footer={footer} />
        </div>
    )
}
