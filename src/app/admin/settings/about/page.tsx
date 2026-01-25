import { createClient } from '@/lib/supabase/server'
import AboutSettingsForm from '@/components/admin/AboutSettingsForm'

export default async function AdminAboutSettingsPage() {
    const supabase = await createClient()
    const { data: section } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'about_page')
        .single()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">About Page Settings</h2>
                <p className="text-gray-400">Customize the dedicated /about page.</p>
            </div>

            <AboutSettingsForm initialData={section} />
        </div>
    )
}
