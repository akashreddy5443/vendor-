'use client'

import { updateSettings, fixDatabasePermissions } from '@/app/admin/settings/actions'
import { useState, useTransition } from 'react'
import { Save, AlertTriangle, ImagePlus, X, Database } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'

export function SettingsForm({ settings }: { settings: any }) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')
    const [logoUrl, setLogoUrl] = useState(settings?.logo_url || '')

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
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">General Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="site_name" className="text-sm font-medium text-gray-700">Site Name</label>
                        <input
                            name="site_name"
                            id="site_name"
                            defaultValue={settings?.site_name}
                            className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="contact_email" className="text-sm font-medium text-gray-700">Contact Email</label>
                        <input
                            name="contact_email"
                            id="contact_email"
                            defaultValue={settings?.contact_email}
                            className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Logo Upload Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Logo Image <span className="text-gray-500 text-xs ml-2">(Recommended: 512x512px Square or 200x50px Transparent PNG)</span>
                    </label>
                    <input type="hidden" name="logo_url" value={logoUrl} />

                    {logoUrl ? (
                        <div className="relative w-32 h-32 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden group">
                            <img src={logoUrl} alt="Logo Preview" className="h-full w-full object-contain p-2" />
                            <button
                                type="button"
                                onClick={() => setLogoUrl('')}
                                className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <CldUploadWidget
                            uploadPreset="ml_default"
                            options={{
                                multiple: false,
                                maxFiles: 1,
                                resourceType: 'image'
                            }}
                            onSuccess={(result: any) => {
                                if (result.info?.secure_url) {
                                    setLogoUrl(result.info.secure_url)
                                }
                            }}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="flex items-center gap-2 px-6 py-4 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg border border-dashed border-gray-300 transition-colors w-full md:w-auto"
                                >
                                    <ImagePlus className="h-5 w-5" />
                                    <span>Upload Logo</span>
                                </button>
                            )}
                        </CldUploadWidget>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">Site Description (SEO)</label>
                    <textarea
                        name="description"
                        id="description"
                        defaultValue={settings?.description}
                        rows={3}
                        className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Pricing & Tax */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Pricing & Tax</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Global Discount (%) - Applied to ALL products</label>
                        <input
                            type="number"
                            name="global_discount_percentage"
                            defaultValue={settings?.global_discount_percentage ?? 0}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Default GST Rate (%)</label>
                        <input
                            type="number"
                            name="default_gst_percentage"
                            defaultValue={settings?.default_gst_percentage ?? 18}
                            min="0"
                            max="100"
                            step="0.1"
                            className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>

            {/* Filter Configuration */ }
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Filter Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Minimum Price (Slider Start)</label>
                <input
                    type="number"
                    name="min_price_filter"
                    defaultValue={settings?.min_price_filter ?? 0}
                    min="0"
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Maximum Price (Slider End)</label>
                <input
                    type="number"
                    name="max_price_filter"
                    defaultValue={settings?.max_price_filter ?? 100000}
                    min="0"
                    className="w-full bg-white border border-gray-300 rounded-md p-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
        </div>
    </div>

    {/* Danger Zone */ }
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium text-red-600 flex items-center gap-2 border-b border-red-100 pb-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                </h3>

                <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div>
                        <div className="font-medium text-red-900">Maintenance Mode</div>
                        <div className="text-sm text-red-700">Disable store access for customers.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="maintenance_mode"
                            defaultChecked={settings?.maintenance_mode}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-md"
                >
                    <Save className="h-4 w-4" />
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>

                <div className="text-right">
                    <button
                        type="button"
                        onClick={async () => {
                            if (!confirm('Run database repair? This will reset order permissions.')) return
                            startTransition(async () => {
                                const res = await import('@/app/admin/settings/actions').then(m => m.fixDatabasePermissions())
                                if (res.error) setMessage(res.error)
                                else setMessage(res.success || 'Fixed!')
                            })
                        }}
                        className="text-xs text-gray-500 hover:text-red-500 underline"
                    >
                        Repair Database Permissions
                    </button>
                </div>
            </div>
        </form >
    )
}
