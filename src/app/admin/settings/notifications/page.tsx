import { createClient } from '@/lib/supabase/server'
import { NotificationSettingsForm } from '@/components/admin/NotificationSettingsForm'

export default async function NotificationSettingsPage() {
    const supabase = await createClient()

    const { data: settings } = await supabase
        .from('notification_settings')
        .select('*')
        .order('key')

    const { data: templates } = await supabase
        .from('notification_templates')
        .select('*')
        .order('template_key')

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Notification & Email Settings</h2>
                <p className="text-gray-500">Manage user notification options and email templates.</p>
            </div>

            <NotificationSettingsForm
                settings={settings || []}
                templates={templates || []}
            />
        </div>
    )
}
