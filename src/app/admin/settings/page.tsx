import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Site Settings</h2>
                <p className="text-gray-500">Configure global website options.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <SettingsForm settings={settings} categories={categories || []} />
            </div>
        </div>
    )
}
