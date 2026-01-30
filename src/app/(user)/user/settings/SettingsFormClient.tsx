'use client'

import { useState } from 'react'
import { User, Phone, Mail, Save, Loader2 } from 'lucide-react'
import { AvatarUpload } from '@/components/user/AvatarUpload'
import { toast } from 'sonner'

export function SettingsFormClient({ profile, email, updateProfileAction }: { profile: any, email: string, updateProfileAction: any }) {
    const [isPending, setIsPending] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        formData.append('avatarUrl', avatarUrl)

        try {
            const res = await updateProfileAction(formData)
            if (res?.error) {
                toast.error(res.error)
            } else {
                toast.success('Profile updated successfully!')
            }
        } catch (err) {
            toast.error('Something went wrong')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="flex justify-center pb-4">
                <AvatarUpload initialUrl={profile?.avatar_url} onUpload={setAvatarUrl} />
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <User className="h-4 w-4" /> Full Name
                    </label>
                    <input
                        name="fullName"
                        defaultValue={profile?.full_name || ''}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Phone Number
                    </label>
                    <div className="flex border border-border rounded-xl shadow-sm bg-background focus-within:ring-2 focus-within:ring-blue-500/20 transition-all overflow-hidden outline-none">
                        <div className="px-4 py-3 bg-muted/50 border-r border-border text-sm text-muted-foreground font-bold select-none">
                            +91
                        </div>
                        <input
                            name="phone"
                            type="tel"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            defaultValue={profile?.phone_number?.replace('+91', '').trim() || ''}
                            className="flex-1 w-full bg-transparent px-4 py-3 text-sm text-foreground focus:outline-none placeholder:text-muted-foreground/30"
                            placeholder="9876543210"
                        />
                    </div>
                </div>

                <div className="space-y-2 opacity-60">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email Address (Read-only)
                    </label>
                    <input
                        disabled
                        defaultValue={email}
                        className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground shadow-sm cursor-not-allowed"
                    />
                </div>
            </div>

            <div className="pt-6">
                <button
                    disabled={isPending}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Save Changes
                </button>
            </div>
        </form>
    )
}
