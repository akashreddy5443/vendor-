import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Site Settings</h2>
                <p className="text-gray-400">Configure global website options.</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <SettingsForm settings={settings} />
            </div>
        </div>
    )
}
