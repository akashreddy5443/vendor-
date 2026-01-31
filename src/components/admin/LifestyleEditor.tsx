'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, Sparkles } from 'lucide-react'
import { updateLifestyle } from '@/app/admin/homepage/actions'

type Item = {
    title: string
    image: string
    link: string
}

export function LifestyleEditor({ initialItems, initialSubtitle, initialTitle }: { initialItems: Item[], initialSubtitle?: string, initialTitle?: string }) {
    const [items, setItems] = useState<Item[]>(initialItems || [
        { title: 'DESK & PRODUCTIVITY', image: '', link: '/search?category=laptops' },
        { title: 'GAMING & PERFORMANCE', image: '', link: '/search?category=audio' },
        { title: 'DAILY TECH GEAR', image: '', link: '/search?category=wearables' },
    ])

    const [subtitle, setSubtitle] = useState(initialSubtitle || 'Collections curated for modern creators')
    const [title, setTitle] = useState(initialTitle || 'Designed For Every Moment')

    const updateItem = (index: number, field: keyof Item, value: string) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const handleSubmit = async (formData: FormData) => {
        formData.append('items', JSON.stringify(items))
        formData.append('subtitle', subtitle)
        formData.append('title', title)
        await updateLifestyle(formData)
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                    Lifestyle Grid
                </h3>
                <p className="text-sm text-slate-500">Customize the lifestyle collections section with premium imagery and compelling copy</p>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium">
                        ✨ <strong>Enhanced Design:</strong> Cards now feature 600px height, 2.5rem corner radius, stronger glassmorphism, and refined hover effects for a premium feel.
                    </p>
                </div>
            </div>
            <form action={handleSubmit} className="space-y-8">
                {/* Section Headings Control */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 space-y-4">
                    <label className="block">
                        <span className="text-sm font-bold text-slate-700 mb-2 block flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                            Main Heading
                        </span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Designed For Every Moment"
                            className="w-full rounded-lg bg-white border border-slate-200 p-3 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                        <p className="text-xs text-slate-600 mt-2">
                            💡 The last two words will be highlighted in blue with a refined underline
                        </p>
                    </label>

                    <label className="block">
                        <span className="text-sm font-bold text-slate-700 mb-2 block flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                            Subtitle
                        </span>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Collections curated for modern creators"
                            className="w-full rounded-lg bg-white border border-slate-200 p-3 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                        <p className="text-xs text-slate-600 mt-2">
                            💡 Use a clear theme that tells a story (e.g., "Work → Play → Everyday Life")
                        </p>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                        <div key={index} className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-black">
                                    {index + 1}
                                </span>
                                Column {index + 1}
                            </h4>

                            {/* Image Upload */}
                            <div className="relative aspect-[4/5] bg-white rounded-xl border-2 border-dashed border-slate-200 overflow-hidden group hover:border-indigo-300 transition-colors">
                                {item.image ? (
                                    <>
                                        <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <CldUploadWidget
                                                uploadPreset="ml_default"
                                                onSuccess={(result: any) => updateItem(index, 'image', result.info.secure_url)}
                                            >
                                                {({ open }) => (
                                                    <button type="button" onClick={() => open()} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition-colors">
                                                        Change Image
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        </div>
                                    </>
                                ) : (
                                    <CldUploadWidget
                                        uploadPreset="ml_default"
                                        onSuccess={(result: any) => updateItem(index, 'image', result.info.secure_url)}
                                    >
                                        {({ open }) => (
                                            <button type="button" onClick={() => open()} className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                <ImagePlus className="w-8 h-8 mb-2" />
                                                <span className="text-sm font-medium">Upload Image</span>
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                )}
                            </div>

                            <input
                                value={item.title}
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                                placeholder="Card Title (e.g., DESK & PRODUCTIVITY)"
                                className="w-full rounded-lg bg-white border border-slate-200 p-3 text-slate-900 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                            />
                            <p className="text-xs text-slate-500">
                                💡 Use bold, action-oriented titles in UPPERCASE for maximum impact
                            </p>
                            <input
                                value={item.link}
                                onChange={(e) => updateItem(index, 'link', e.target.value)}
                                placeholder="Link URL (e.g., /search?category=laptops)"
                                className="w-full rounded-lg bg-white border border-slate-200 p-3 text-slate-900 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                            />
                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                <p className="text-xs text-amber-700">
                                    <strong>Image Tips:</strong> Use consistent lighting, similar angles, and clean backgrounds for visual cohesion
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all">
                    Save Lifestyle Grid
                </button>
            </form>
        </section>
    )
}
