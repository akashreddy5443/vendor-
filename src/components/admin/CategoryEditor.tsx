'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, Trash2 } from 'lucide-react'
import * as Icons from 'lucide-react'
import { updateCategory } from '@/app/admin/categories/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconPicker } from '@/components/admin/IconPicker'

export function CategoryEditor({ category }: { category: any }) {
    const [name, setName] = useState(category.name)
    const [slug, setSlug] = useState(category.slug)
    const [icon, setIcon] = useState(category.icon || '')
    const [imageUrl, setImageUrl] = useState(category.image_url || '')
    const [showIconPicker, setShowIconPicker] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            // Use API route instead of server action to avoid server component render issues
            const response = await fetch('/api/test-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: category.id,
                    name,
                    slug,
                    icon,
                    image_url: imageUrl
                })
            })

            const result = await response.json()

            if (!response.ok || result.error) {
                throw new Error(result.error || 'Update failed')
            }

            // Success! Navigate back to categories list
            router.push('/admin/categories')
            router.refresh()
        } catch (err: any) {
            console.error('Error updating category:', err)
            setError(err.message || 'Failed to update category. Please try again.')
            setIsLoading(false)
        }
    }

    const renderIcon = () => {
        if (!icon) return null
        const IconComponent = (Icons as any)[icon]
        if (!IconComponent) return <span className="text-2xl">{icon}</span>
        return <IconComponent className="w-8 h-8" />
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">Elevate Category</h2>
                <p className="text-gray-500">Transform this unit with high-fidelity assets.</p>
            </div>

            <div className="rounded-[2.5rem] border border-gray-100 bg-white/80 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-100/50">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Visual Asset Section */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Visual Identity</label>
                        <div className="flex items-center gap-6">
                            <div className="relative h-32 w-28 shrink-0 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group transition-all hover:border-indigo-300">
                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <CldUploadWidget
                                                uploadPreset="ml_default"
                                                onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
                                            >
                                                {({ open }) => (
                                                    <button type="button" onClick={() => open()} className="text-[10px] font-black text-white uppercase tracking-widest px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
                                                        Change
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        </div>
                                    </>
                                ) : (
                                    <CldUploadWidget
                                        uploadPreset="ml_default"
                                        onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
                                    >
                                        {({ open }) => (
                                            <button type="button" onClick={() => open()} className="flex flex-col items-center text-gray-400 hover:text-indigo-600 transition-colors">
                                                <ImagePlus className="w-8 h-8 mb-2" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Upload Cover</span>
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <h4 className="text-sm font-bold text-gray-900">Category Cover</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Upload a high-resolution vertical asset (aspect 4:5). This will be displayed in the "Browse Categories" matrix on the homepage.
                                </p>
                                {imageUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-600"
                                    >
                                        Remove Asset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Display Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-bold text-gray-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                placeholder="e.g. Laptops"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">URL Slug</label>
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-mono font-medium text-gray-600 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                placeholder="laptops"
                            />
                        </div>
                    </div>

                    {/* Icon Picker Section */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category Icon</label>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setShowIconPicker(true)}
                                className="flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50/50 hover:bg-indigo-50/50 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
                                    {icon ? renderIcon() : <ImagePlus className="w-6 h-6" />}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-gray-900">
                                        {icon || 'Select Icon'}
                                    </div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                                        Click to change
                                    </div>
                                </div>
                            </button>
                            {icon && (
                                <button
                                    type="button"
                                    onClick={() => setIcon('')}
                                    className="px-4 py-2 text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            This icon will appear in the Navbar catalog dropdown beside the category name.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-50">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-2xl bg-indigo-600 py-4 font-black text-white hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase text-xs tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? 'Syncing...' : 'Sync to Production'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Icon Picker Modal */}
            {showIconPicker && (
                <IconPicker
                    value={icon}
                    onChange={setIcon}
                    onClose={() => setShowIconPicker(false)}
                />
            )}
        </div>
    )
}
