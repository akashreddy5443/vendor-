'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Camera, Save, Loader2, User, Phone, Bell, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface SettingsFormProps {
    initialFullName: string
    email: string
    hasPassword?: boolean
    phone?: string
    avatarUrl?: string
    notifications?: { marketing: boolean, orders: boolean }
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
    updateProfile,
    updatePassword
}: SettingsFormProps) {
    const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] = useState(initialAvatar || '')
    const [notifs, setNotifs] = useState(initialNotifs || { marketing: false, orders: true })

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

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">

                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center relative">
                            {avatar ? (
                                <Image src={avatar} alt="Profile" fill className="object-cover" />
                            ) : (
                                <User className="h-10 w-10 text-muted-foreground" />
                            )}
                        </div>
                        <CldUploadWidget
                            uploadPreset="techdev_uploads" // Ensure this preset exists or is unsigned
                            onSuccess={(result: any) => {
                                setAvatar(result.info.secure_url)
                            }}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-full cursor-pointer"
                                >
                                    <Camera className="h-6 w-6" />
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">Click image to upload new photo.</p>
                    </div>
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
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Receive Order Updates (Email)</span>
                        <button
                            type="button"
                            onClick={() => setNotifs({ ...notifs, orders: !notifs.orders })}
                            className={`w-11 h-6 rounded-full transition-colors relative ${notifs.orders ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifs.orders ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Receive Marketing Emails</span>
                        <button
                            type="button"
                            onClick={() => setNotifs({ ...notifs, marketing: !notifs.marketing })}
                            className={`w-11 h-6 rounded-full transition-colors relative ${notifs.marketing ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                        >
                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifs.marketing ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
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
