'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus } from 'lucide-react'
import { updateLifestyle } from '@/app/admin/homepage/actions'

type Item = {
    title: string
    image: string
    link: string
}

export function LifestyleEditor({ initialItems, initialSubtitle }: { initialItems: Item[], initialSubtitle?: string }) {
    const [items, setItems] = useState<Item[]>(initialItems || [
        { title: 'DESK & PRODUCTIVITY', image: '', link: '/search?category=laptops' },
        { title: 'GAMING & PERFORMANCE', image: '', link: '/search?category=audio' },
        { title: 'DAILY TECH GEAR', image: '', link: '/search?category=wearables' },
    ])

    const [subtitle, setSubtitle] = useState(initialSubtitle || 'Collections curated for modern creators')

    const updateItem = (index: number, field: keyof Item, value: string) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const handleSubmit = async (formData: FormData) => {
        formData.append('items', JSON.stringify(items))
        formData.append('subtitle', subtitle)
        await updateLifestyle(formData)
    }

    return (
        <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-4 text-xl font-bold text-purple-500">Lifestyle Grid (3 Column)</h3>
            <form action={handleSubmit} className="space-y-6">
                {/* Phase 1: Section Subtitle Control */}
                <div className="bg-gray-950 p-4 rounded border border-gray-800 space-y-3">
                    <label className="block">
                        <span className="text-sm font-bold text-gray-400 mb-2 block">Section Subtitle</span>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            placeholder="Collections curated for modern creators"
                            className="w-full rounded bg-gray-900 border border-gray-700 p-3 text-white"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            💡 Tip: Use a clear theme that tells a story (e.g., "Work → Play → Everyday Life")
                        </p>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item, index) => (
                        <div key={index} className="space-y-4 bg-gray-950 p-4 rounded border border-gray-800">
                            <h4 className="font-bold text-gray-400 text-sm">Column {index + 1}</h4>

                            {/* Image Upload */}
                            <div className="relative aspect-[4/5] bg-gray-900 rounded border border-gray-700 overflow-hidden group">
                                {item.image ? (
                                    <>
                                        <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <CldUploadWidget
                                                uploadPreset="ml_default"
                                                onSuccess={(result: any) => updateItem(index, 'image', result.info.secure_url)}
                                            >
                                                {({ open }) => (
                                                    <button type="button" onClick={() => open()} className="bg-white text-black px-3 py-1 rounded text-xs font-bold"> Change </button>
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
                                            <button type="button" onClick={() => open()} className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                                <ImagePlus className="w-6 h-6 mb-2" />
                                                <span className="text-xs">Upload</span>
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                )}
                            </div>

                            <input
                                value={item.title}
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                                placeholder="Title"
                                className="w-full rounded bg-gray-900 border border-gray-700 p-2 text-white text-sm"
                            />
                            <input
                                value={item.link}
                                onChange={(e) => updateItem(index, 'link', e.target.value)}
                                placeholder="Link URL"
                                className="w-full rounded bg-gray-900 border border-gray-700 p-2 text-white text-sm"
                            />
                        </div>
                    ))}
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded font-bold text-sm">
                    Save Lifestyle Grid
                </button>
            </form>
        </section>
    )
}
