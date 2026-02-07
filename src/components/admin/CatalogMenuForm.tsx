'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Layout, Save, Upload, Image as ImageIcon, ExternalLink, Type, Palette, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { ImageCropper } from '@/components/admin/ImageCropper'
import { toast } from 'sonner'

interface CatalogMenuSettingsFormProps {
    initialData: any
}

export function CatalogMenuSettingsForm({ initialData }: CatalogMenuSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        badge: 'New Arrival',
        title: 'Summer Collection',
        subtitle: 'Explore our latest gadgets and accessories.',
        link: '/products',
        linkText: 'Shop Now',
        background_url: '',
        text_color: '#FFFFFF', // Default to white since we encourage dark/blue cards
        ...initialData
    })

    // Cropper State
    const [isCropperOpen, setIsCropperOpen] = useState(false)
    const [tempImageFile, setTempImageFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    // Handle File Selection -> Open Cropper
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        setTempImageFile(file)
        setIsCropperOpen(true)
        // Reset input
        e.target.value = ''
    }

    // Handle Cropped Image Upload
    const handleCropComplete = async (croppedBlob: Blob) => {
        setIsUploading(true)
        try {
            const supabase = createClient()
            const fileExt = 'webp' // Convert to webp for performance
            const fileName = `catalog-promo-${Date.now()}.${fileExt}`
            const filePath = `homepage/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('images') // Ensure this bucket exists, or use 'products'
                .upload(filePath, croppedBlob, { contentType: 'image/webp' })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath)

            setSettings(prev => ({ ...prev, background_url: publicUrl }))
            alert('Image cropped and uploaded!')
        } catch (error) {
            console.error('Upload error:', error)
            alert('Failed to upload image')
        } finally {
            setIsUploading(false)
            setTempImageFile(null)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/homepage/catalog-menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })

            if (!response.ok) throw new Error('Failed to save settings')

            alert('Catalog menu updated successfully')
        } catch (error) {
            console.error('Save error:', error)
            alert('Failed to save changes')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Catalog Menu</h2>
                    <p className="text-slate-500">Customize the mega menu dropdown: Categories Grid & Promo Card.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Settings */}
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    {/* Promo Card Image */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Promo Card Background</label>
                        <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all p-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-3">
                                {isUploading ? (
                                    <div className="h-32 w-full flex flex-col items-center justify-center gap-2 text-blue-600">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        <span className="text-xs font-bold">Uploading...</span>
                                    </div>
                                ) : settings.background_url ? (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-sm">
                                        <Image
                                            src={settings.background_url}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
                                            <span className="flex items-center gap-2 font-bold text-sm bg-white/20 backdrop-blur px-3 py-1.5 rounded-full">
                                                <Upload className="w-4 h-4" /> Change Image
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                )}
                                {!settings.background_url && (
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-slate-700">Click to upload image</div>
                                        <p className="text-xs text-slate-400 mt-1">Has built-in cropper. Recommended: Vertical orientation.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Text Inputs */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Badge</label>
                                <input
                                    type="text"
                                    value={settings.badge}
                                    onChange={(e) => setSettings({ ...settings, badge: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Text Color</label>
                                <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                    <button
                                        onClick={() => setSettings({ ...settings, text_color: '#FFFFFF' })}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${settings.text_color === '#FFFFFF' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                                    >
                                        Light
                                    </button>
                                    <button
                                        onClick={() => setSettings({ ...settings, text_color: '#0F172A' })}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${settings.text_color === '#0F172A' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                                    >
                                        Dark
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                            <input
                                type="text"
                                value={settings.title}
                                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subtitle</label>
                            <textarea
                                rows={2}
                                value={settings.subtitle}
                                onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link Url</label>
                                <input
                                    type="text"
                                    value={settings.link}
                                    onChange={(e) => setSettings({ ...settings, link: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Link Text</label>
                                <input
                                    type="text"
                                    value={settings.linkText}
                                    onChange={(e) => setSettings({ ...settings, linkText: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visual Preview */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Live Preview</label>
                    <div className="bg-slate-100 p-8 rounded-3xl flex justify-center border border-slate-200 min-h-[500px] overflow-hidden">

                        {/* Navbar Simulation */}
                        <div className="w-[850px] bg-white rounded-2xl shadow-xl overflow-hidden flex transform scale-[0.85] origin-top-center h-fit">

                            {/* Left: Layout Grid */}
                            <div className="w-[320px] bg-white p-6 border-r border-slate-100 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Shop By Category</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                                                <div className="w-6 h-6 rounded bg-slate-200"></div>
                                                <div className="h-2 w-12 bg-slate-200 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-50">
                                    <div className="h-3 w-24 bg-blue-50 rounded"></div>
                                </div>
                            </div>

                            {/* Right: Blue Promo Card */}
                            <div className="flex-1 relative min-h-[380px] bg-blue-600 flex flex-col justify-end p-8 text-white overflow-hidden">
                                {settings.background_url && (
                                    <>
                                        <img src={settings.background_url} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    </>
                                )}

                                <div className="relative z-10 max-w-[80%]">
                                    <span className="inline-block px-3 py-1 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">
                                        {settings.badge}
                                    </span>
                                    <h2 className="text-3xl font-heading font-black leading-tight mb-3">
                                        {settings.title}
                                    </h2>
                                    <p className="text-sm font-medium opacity-90 mb-6 leading-relaxed">
                                        {settings.subtitle}
                                    </p>
                                    <div className="bg-white text-slate-900 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2">
                                        {settings.linkText} <span className="text-xs">→</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Cropper Modal */}
            <ImageCropper
                isOpen={isCropperOpen}
                onClose={() => setIsCropperOpen(false)}
                imageFile={tempImageFile}
                aspectRatio={4 / 5} // Perfect vertical card ratio
                onCropComplete={handleCropComplete}
            />
        </div>
    )
}
