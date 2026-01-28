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

export function LifestyleEditor({ initialItems }: { initialItems: Item[] }) {
    const [items, setItems] = useState<Item[]>(initialItems || [
        { title: 'WORK ESSENTIALS', image: '', link: '/search?category=laptops' },
        { title: 'AFTER HOURS', image: '', link: '/search?category=audio' },
        { title: 'EVERYDAY CARRY', image: '', link: '/search?category=wearables' },
    ])

    const updateItem = (index: number, field: keyof Item, value: string) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const handleSubmit = async (formData: FormData) => {
        formData.append('items', JSON.stringify(items))
        await updateLifestyle(formData)
    }

    return (
        <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-4 text-xl font-bold text-purple-500">Lifestyle Grid (3 Column)</h3>
            <form action={handleSubmit} className="space-y-6">
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
