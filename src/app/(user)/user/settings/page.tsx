import { createClient } from '@/lib/supabase/server'
import { User, Phone, Mail, Save } from 'lucide-react'
import { updateProfile } from './actions'
import { redirect } from 'next/navigation'

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

            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <form action={async (formData) => {
                    'use server'
                    await updateProfile(formData)
                }} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <User className="h-4 w-4" /> Full Name
                            </label>
                            <input
                                name="fullName"
                                defaultValue={profile?.full_name || ''}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Phone className="h-4 w-4" /> Phone Number
                            </label>
                            <input
                                name="phone"
                                defaultValue={profile?.phone_number || ''}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className="space-y-2 opacity-50 cursor-not-allowed">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Email Address
                            </label>
                            <input
                                disabled
                                defaultValue={user.email}
                                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground shadow-sm"
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-500">
                            <Save className="h-4 w-4" /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
