'use client'

import { useState } from 'react'
import { Lock, Save, Loader2 } from 'lucide-react'

export default function SettingsForm({
    initialFullName,
    updateProfile,
    updatePassword
}: {
    initialFullName: string,
    updateProfile: any,
    updatePassword: any
}) {
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [loadingPass, setLoadingPass] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    const [showPassword, setShowPassword] = useState(false)

    async function handleProfileUpdate(formData: FormData) {
        setLoadingProfile(true)
        setMessage(null)
        const res = await updateProfile(formData)
        setLoadingProfile(false)
        if (res.error) setMessage({ text: res.error, type: 'error' })
        if (res.success) setMessage({ text: res.success, type: 'success' })
    }

    async function handlePasswordUpdate(formData: FormData) {
        setLoadingPass(true)
        setMessage(null)
        const res = await updatePassword(formData)
        setLoadingPass(false)
        if (res.error) setMessage({ text: res.error, type: 'error' })
        if (res.success) {
            setMessage({ text: res.success, type: 'success' })
            // Reset form
            const form = document.getElementById('password-form') as HTMLFormElement
            form.reset()
        }
    }

    return (
        <div className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {message.text}
                </div>
            )}

            {/* Change Name Form */}
            <form action={handleProfileUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                        name="fullName"
                        defaultValue={initialFullName}
                        required
                        type="text"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none"
                    />
                </div>
                <button disabled={loadingProfile} type="submit" className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-bold text-black hover:bg-gray-200 disabled:opacity-50">
                    {loadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Profile
                </button>
            </form>

            <div className="border-t border-zinc-800 pt-8 mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-orange-500">
                        <Lock className="h-5 w-5" /> Security
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-orange-500 hover:text-orange-400 font-medium"
                    >
                        {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                    </button>
                </div>

                <form id="password-form" action={handlePasswordUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                            <input name="password" type={showPassword ? "text" : "password"} required minLength={6} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                            <input name="confirmPassword" type={showPassword ? "text" : "password"} required minLength={6} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                        </div>
                    </div>
                    <button disabled={loadingPass} type="submit" className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 font-bold text-white hover:bg-zinc-700 disabled:opacity-50">
                        {loadingPass ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
