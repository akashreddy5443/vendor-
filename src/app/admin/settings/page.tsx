import { createClient } from '@/lib/supabase/server'
import { updateSettings } from './actions'

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
                <form action={updateSettings} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="site_name" className="text-sm font-medium text-gray-200">
                            Site Name
                        </label>
                        <input
                            id="site_name"
                            name="site_name"
                            defaultValue={settings?.site_name || 'TechDev Store'}
                            className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="maintenance_mode"
                            name="maintenance_mode"
                            defaultChecked={settings?.maintenance_mode}
                            className="h-4 w-4 rounded border-gray-700 bg-gray-950 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="maintenance_mode" className="text-sm font-medium text-gray-200">
                            Maintenance Mode
                        </label>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="rounded-md bg-orange-600 px-4 py-2 font-bold text-white transition-colors hover:bg-orange-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
