'use client'

import { useState } from 'react'

import { Save, Loader2, User, Phone, Bell, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface SettingsFormProps {
    initialFullName: string
    email: string
    hasPassword?: boolean
    phone?: string
    avatarUrl?: string
    notifications?: any
    availableNotifications?: any[]
    updateProfile: (formData: FormData) => Promise<{ error?: string, success?: string }>
    updatePassword: (formData: FormData) => Promise<{ error?: string, success?: string }>
}

export default function SettingsForm({
    initialFullName,
    email,
    hasPassword,
    phone: initialPhone,
    avatarUrl: initialAvatar,
    notifications: initialNotifs,
    availableNotifications = [],
    updateProfile,
    updatePassword
}: SettingsFormProps) {
    const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] = useState(initialAvatar || '')

    // Initialize notifications state: use user's preference if set, otherwise default to true (opt-in by default)
    const [notifs, setNotifs] = useState(() => {
        const defaults: any = {}
        availableNotifications.forEach((n: any) => {
            // If user has a preference, use it. If not, default to true.
            defaults[n.key] = initialNotifs?.[n.key] !== undefined ? initialNotifs[n.key] : true
        })
        return defaults
    })

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        // Append extra fields maintained in state
        formData.append('avatarUrl', avatar)
        formData.append('notifications', JSON.stringify(notifs))

        const res = await updateProfile(formData)
        setLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success('Profile updated successfully')
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await updatePassword(formData)
        setLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success('Password updated successfully')
            // clear inputs
            e.currentTarget.reset()
        }
    }

    // Toggle handler
    const toggleNotification = (key: string) => {
        setNotifs((prev: any) => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">

                {/* Avatar Section */}
                <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Profile Picture</h3>
                    <div className="flex items-center gap-6">
                        {/* Male Option */}
                        <button
                            type="button"
                            onClick={() => setAvatar('/avatars/male.svg')}
                            className={`relative group rounded-full p-1 border-2 transition-all ${avatar === '/avatars/male.svg' ? 'border-brand-orange scale-110' : 'border-transparent hover:border-border'}`}
                        >
                            <div className="h-20 w-20 rounded-full overflow-hidden bg-muted relative">
                                <Image src="/avatars/male.svg" alt="Male" fill className="object-cover" />
                            </div>
                            {avatar === '/avatars/male.svg' && (
                                <div className="absolute -top-2 -right-2 bg-brand-orange text-white rounded-full p-1">
                                    <div className="h-3 w-3 bg-white rounded-full" />
                                </div>
                            )}
                        </button>

                        {/* Female Option */}
                        <button
                            type="button"
                            onClick={() => setAvatar('/avatars/female.svg')}
                            className={`relative group rounded-full p-1 border-2 transition-all ${avatar === '/avatars/female.svg' ? 'border-brand-orange scale-110' : 'border-transparent hover:border-border'}`}
                        >
                            <div className="h-20 w-20 rounded-full overflow-hidden bg-muted relative">
                                <Image src="/avatars/female.svg" alt="Female" fill className="object-cover" />
                            </div>
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground">Select a default avatar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <User className="h-4 w-4" /> Full Name
                        </label>
                        <input
                            name="fullName"
                            defaultValue={initialFullName}
                            required
                            className="w-full bg-input border-border text-foreground px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Phone Number
                        </label>
                        <input
                            name="phone"
                            defaultValue={initialPhone}
                            className="w-full bg-input border-border text-foreground px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="+1 234 567 890"
                        />
                    </div>
                </div>

                {/* Notifications Toggles */}
                <div className="bg-secondary/30 p-4 rounded-lg border border-border space-y-4">
                    <h4 className="flex items-center gap-2 font-bold text-foreground text-sm">
                        <Bell className="h-4 w-4" /> Notification Preferences
                    </h4>

                    {availableNotifications.length > 0 ? (
                        availableNotifications.map((notification) => (
                            <div key={notification.key} className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="text-sm text-foreground font-medium">{notification.label}</div>
                                    {notification.description && (
                                        <div className="text-xs text-muted-foreground">{notification.description}</div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => toggleNotification(notification.key)}
                                    className={`w-11 h-6 rounded-full transition-colors relative ${notifs[notification.key] ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                >
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifs[notification.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-muted-foreground text-center py-2">No notification settings available.</div>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-orange hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all shadow-md shadow-orange-900/10"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </button>
                </div>
            </form>

            <div className="border-t border-border my-8" />

            {/* Password Form (Only if email provider) */}
            {hasPassword && (
                <div className="opacity-80 hover:opacity-100 transition-opacity">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-foreground">
                        <Lock className="h-5 w-5 text-muted-foreground" /> Security
                    </h2>
                    <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">New Password</label>
                            <input type="password" name="password" required minLength={6} className="w-full bg-input border-border text-foreground px-4 py-3 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                            <input type="password" name="confirmPassword" required minLength={6} className="w-full bg-input border-border text-foreground px-4 py-3 rounded-lg" />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-secondary hover:bg-secondary/80 text-foreground font-bold py-3 px-6 rounded-lg text-sm transition-colors"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
