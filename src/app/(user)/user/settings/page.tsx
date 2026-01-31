import { createClient } from '@/lib/supabase/server'
import { User, Phone, Mail, Save } from 'lucide-react'
import { updateUserProfile } from './actions'
import { redirect } from 'next/navigation'
import { SettingsFormClient } from './SettingsFormClient'

export default async function UserSettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="space-y-8 max-w-2xl">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-serif">Account Settings</h2>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <SettingsFormClient
                    profile={profile}
                    email={user.email!}
                    updateProfileAction={updateUserProfile}
                />
            </div>
        </div>
    )
}
