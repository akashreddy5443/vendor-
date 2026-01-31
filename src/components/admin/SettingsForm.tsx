'use client'

import { updateSettings, fixDatabasePermissions } from '@/app/admin/settings/actions'
import { useState, useTransition } from 'react'
import { Save, AlertTriangle, ImagePlus, X, Plus, Trash2 } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'

export function SettingsForm({ settings }: { settings: any }) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')
    const [logoUrl, setLogoUrl] = useState(settings?.logo_url || '')

    // Price Presets State
    const [presets, setPresets] = useState<any[]>(settings?.price_presets || [
        { label: 'Under ₹20,000', min: 0, max: 20000 },
        { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
        { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
        { label: 'Over ₹1,00,000', min: 100000, max: 1000000 }
    ])

    const addPreset = () => {
        setPresets([...presets, { label: 'New Range', min: 0, max: 10000 }])
    }

    const removePreset = (index: number) => {
        setPresets(presets.filter((_, i) => i !== index))
    }

    const updatePreset = (index: number, field: string, value: any) => {
        const newPresets = [...presets]
        newPresets[index] = { ...newPresets[index], [field]: value }
        setPresets(newPresets)
    }

    const handleSubmit = (formData: FormData) => {
        setMessage('')
        startTransition(async () => {
            const result = await updateSettings(formData)
            if (result.error) {
                setMessage(result.error)
            } else {
                setMessage('Settings saved!')
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

            {/* Filter Configuration */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Filter Configuration</h3>

                {/* Global Min/Max */}
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

                {/* VISUAL PRESET EDITOR */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Price Range Presets</label>
                        <button
                            type="button"
                            onClick={addPreset}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add Preset
                        </button>
                    </div>

                    <input type="hidden" name="price_presets" value={JSON.stringify(presets)} />

                    <div className="space-y-3">
                        {presets.map((preset, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 p-3 rounded-lg border border-gray-200 group">
                                <div className="flex-1 w-full">
                                    <label className="text-xs text-gray-500 mb-1 block">Label</label>
                                    <input
                                        type="text"
                                        value={preset.label}
                                        onChange={(e) => updatePreset(idx, 'label', e.target.value)}
                                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Under ₹5000"
                                    />
                                </div>
                                <div className="w-full md:w-32">
                                    <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                                    <input
                                        type="number"
                                        value={preset.min}
                                        onChange={(e) => updatePreset(idx, 'min', Number(e.target.value))}
                                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="w-full md:w-32">
                                    <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                                    <input
                                        type="number"
                                        value={preset.max}
                                        onChange={(e) => updatePreset(idx, 'max', Number(e.target.value))}
                                        className="w-full bg-white border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removePreset(idx)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors mt-4 md:mt-0"
                                    title="Remove Preset"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {presets.length === 0 && (
                            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                                No presets defined. Filters will be empty.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
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
