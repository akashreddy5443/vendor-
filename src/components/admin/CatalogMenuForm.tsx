'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Layout, Save, Upload, Image as ImageIcon, ExternalLink, Type, Palette } from 'lucide-react'
import Image from 'next/image'

interface CatalogMenuSettingsFormProps {
    initialData: any
}

export function CatalogMenuSettingsForm({ initialData }: CatalogMenuSettingsFormProps) {
    const [loading, setLoading] = useState(false)
    const [settings, setSettings] = useState(initialData?.content_json || {
        badge: 'New Arrival',
        title: 'Summer Tech Collection',
        subtitle: 'Upgrade your setup today.',
        link: '/products',
        linkText: 'Shop Now',
        background_url: '',
        text_color: '#0F172A'
    })

    const handleSave = async () => {
        setLoading(true)
        const supabase = createClient()

        const { error } = await supabase
            .from('homepage_sections')
            .upsert({
                section_type: 'catalog_menu',
                content_json: settings,
                is_active: true,
                updated_at: new Date().toISOString()
            }, { onConflict: 'section_type' })

        if (error) {
            alert('Error saving settings')
            console.error(error)
        } else {
            alert('Catalog menu updated!')
        }
        setLoading(false)
    }

    const handleImageUpload = Async(e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Simple check for image type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file')
            return
        }

        const supabase = createClient()
        const fileExt = file.name.split('.').pop()
        const fileName = `catalog-promo-${Math.random()}.${fileExt}`
        const filePath = `promo-images/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('products') // Using products bucket as general storage for now or 'images' if available
            .upload(filePath, file)

        if (uploadError) {
            alert('Error uploading image: ' + uploadError.message)
            return
        }

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath)

        setSettings({ ...settings, background_url: publicUrl })
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <Layout className="w-6 h-6 text-blue-600" />
                        Catalog Dropdown Promo
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Customize the promo card inside the main navigation catalog dropdown.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Editor Inputs */}
                <div className="space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Background Image</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all group cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-3">
                                {settings.background_url ? (
                                    <div className="relative w-full h-32 rounded-lg overflow-hidden shadow-md">
                                        <Image
                                            src={settings.background_url}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                )}
                                <div className="text-sm text-slate-600">
                                    <span className="font-bold text-blue-600">Click to upload</span> or drag and drop
                                </div>
                                <p className="text-xs text-slate-400">Recommended: 600x800px or vertical aspect ratio</p>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Badge Text</label>
                            <input
                                type="text"
                                value={settings.badge}
                                onChange={(e) => setSettings({ ...settings, badge: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Badge Color</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                                value="blue" // Hardcoded for now, could be dynamic
                                disabled
                            >
                                <option value="blue">Brand Blue</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Title</label>
                        <input
                            type="text"
                            value={settings.title}
                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subtitle</label>
                        <input
                            type="text"
                            value={settings.subtitle}
                            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Button Link</label>
                            <div className="relative">
                                <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={settings.link}
                                    onChange={(e) => setSettings({ ...settings, link: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Button Text</label>
                            <input
                                type="text"
                                value={settings.linkText}
                                onChange={(e) => setSettings({ ...settings, linkText: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Text Color Override</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setSettings({ ...settings, text_color: '#0F172A' })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${settings.text_color === '#0F172A' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                            >
                                <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-200"></div> Dark
                            </button>
                            <button
                                onClick={() => setSettings({ ...settings, text_color: '#FFFFFF' })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${settings.text_color === '#FFFFFF' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                            >
                                <div className="w-4 h-4 rounded-full bg-white border border-slate-200"></div> Light
                            </button>
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="flex flex-col gap-4">
                    <label className="block text-sm font-bold text-slate-700">Live Preview</label>
                    <div className="bg-slate-100 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                        {/* The Card Component */}
                        <div
                            className="w-[300px] h-[400px] rounded-2xl p-6 flex flex-col justify-end items-start relative overflow-hidden shadow-xl"
                            style={{
                                backgroundColor: settings.background_url ? 'transparent' : '#F1F5F9' // slate-100 default
                            }}
                        >
                            {/* Background Image */}
                            {settings.background_url && (
                                <>
                                    <Image
                                        src={settings.background_url}
                                        alt="Promo Background"
                                        fill
                                        className="object-cover z-0"
                                    />
                                    {/* Gradient Overlay for Text Readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                </>
                            )}

                            {/* Content */}
                            <div className="relative z-20 w-full" style={{ color: settings.background_url ? '#FFFFFF' : settings.text_color }}>
                                <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-md mb-3 ${settings.background_url ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`}>
                                    {settings.badge}
                                </span>
                                <h4 className="font-heading font-black text-2xl leading-tight mb-2">
                                    {settings.title}
                                </h4>
                                <p className={`text-sm mb-6 ${settings.background_url ? 'text-white/80' : 'text-slate-500'}`}>
                                    {settings.subtitle}
                                </p>
                                <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 ${settings.background_url ? 'text-white' : 'text-blue-600'}`}>
                                    {settings.linkText} <span className="text-lg">→</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-xs text-slate-400">
                        This is how it will appear in the navigation dropdown.
                    </p>
                </div>
            </div>
        </div>
    )
}
