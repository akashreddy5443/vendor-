import { createClient } from '@/lib/supabase/server'
import TrustSettingsForm from '@/components/admin/TrustSettingsForm'

export default async function AdminTrustSettingsPage() {
    const supabase = await createClient()
    const { data: section } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'trust_section')
        .single()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Trust Channel Settings</h2>
                <p className="text-gray-500">Customize the "Why Customers Trust Us" section on the homepage.</p>
            </div>

            <TrustSettingsForm initialData={section} />
        </div>
    )
}
