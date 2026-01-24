'use client'

import { updateSettings } from '@/app/admin/settings/actions'
import { useState, useTransition } from 'react'
import { Save, AlertTriangle } from 'lucide-react'

export function SettingsForm({ settings }: { settings: any }) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')

    const handleSubmit = (formData: FormData) => {
        setMessage('')
        startTransition(async () => {
            const result = await updateSettings(formData)
            if (result.error) {
                setMessage(result.error)
            } else {
                setMessage('Settings saved!')
                // Clear message after 3s
                setTimeout(() => setMessage(''), 3000)
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg ${message.includes('saved') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message}
                </div>
            )}

            {/* General Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-gray-800 pb-2">General Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="site_name" className="text-sm font-medium text-gray-400">Site Name</label>
                        <input
                            name="site_name"
                            id="site_name"
                            defaultValue={settings?.site_name}
                            className="w-full bg-gray-950 border border-gray-800 rounded-md p-2 text-white focus:border-orange-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="contact_email" className="text-sm font-medium text-gray-400">Contact Email</label>
                        <input
                            name="contact_email"
                            id="contact_email"
                            defaultValue={settings?.contact_email}
                            className="w-full bg-gray-950 border border-gray-800 rounded-md p-2 text-white focus:border-orange-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-400">Site Description (SEO)</label>
                    <textarea
                        name="description"
                        id="description"
                        defaultValue={settings?.description}
                        rows={3}
                        className="w-full bg-gray-950 border border-gray-800 rounded-md p-2 text-white focus:border-orange-500 outline-none"
                    />
                </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-red-400 flex items-center gap-2 border-b border-red-900/30 pb-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                </h3>

                <div className="flex items-center justify-between p-4 border border-red-900/30 bg-red-900/10 rounded-lg">
                    <div>
                        <div className="font-medium text-white">Maintenance Mode</div>
                        <div className="text-sm text-gray-400">Disable store access for customers.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="maintenance_mode"
                            defaultChecked={settings?.maintenance_mode}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}
