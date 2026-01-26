import { createClient } from '@/lib/supabase/server' // Server Component
import { updateProfile, updatePassword } from './actions'
import { User, Lock, Mail, Save } from 'lucide-react'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/user/SettingsForm'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch active notification toggles
    const { data: notificationSettings } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('is_active', true)
        .order('key')

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground mb-8">Manage your profile and security preferences.</p>

            <div className="grid gap-8">
                {/* Profile Section */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-blue-600">
                        <User className="h-5 w-5" /> Profile Details
                    </h2>

                    {/* Read-only Email */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/50 text-foreground cursor-not-allowed">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                            <span className="ml-auto text-xs bg-muted px-2 py-1 rounded text-muted-foreground border border-border">Read Only</span>
                        </div>
                    </div>

                    <SettingsForm
                        initialFullName={profile?.full_name || ''}
                        email={user.email || ''}
                        phone={profile?.phone || ''}
                        avatarUrl={profile?.avatar_url || ''}
                        notifications={profile?.notification_preferences}
                        availableNotifications={notificationSettings || []}
                        hasPassword={user?.app_metadata?.providers?.includes('email')}
                        updateProfile={updateProfile}
                        updatePassword={updatePassword}
                    />
                </div>
            </div>
        </div>
    )
}
