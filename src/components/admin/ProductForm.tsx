'use client'

import { createProduct } from '@/app/admin/products/actions'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'

interface ProductFormProps {
    categories?: { id: string, name: string }[]
}

export function ProductForm({ categories = [] }: ProductFormProps) {
    const [media, setMedia] = useState<{ url: string, type: 'image' | 'video' }[]>([])

    const addMedia = (url: string, type: string) => {
        // Cloudinary returns 'image' or 'video'. We map it to our type.
        // Ensure type is 'image' or 'video'
        const mediaType = type === 'video' ? 'video' : 'image'
        setMedia(prev => [...prev, { url, type: mediaType }])
    }

    const removeMedia = (index: number) => {
        setMedia(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (formData: FormData) => {
        await createProduct(formData)
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-200">
                        Product Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        required
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                        placeholder="e.g. LTT Screwdriver"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category_id" className="text-sm font-medium text-gray-200">
                        Category
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                    >
                        <option value="">Select a Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-200">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Product details..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium text-gray-200">
                        Price (₹)
                    </label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        required
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                        placeholder="0.00"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="stock" className="text-sm font-medium text-gray-200">
                        Stock
                    </label>
                    <input
                        id="stock"
                        name="stock"
                        type="number"
                        required
                        defaultValue={0}
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-200">Media Gallery (Images & Videos)</label>
                <input type="hidden" name="media" value={JSON.stringify(media)} />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {media.map((item, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-gray-700 bg-black/50 group">
                            {item.type === 'video' ? (
                                <video src={item.url} className="h-full w-full object-cover" />
                            ) : (
                                <img src={item.url} alt={`Media ${index}`} className="h-full w-full object-cover" />
                            )}

                            <button
                                type="button"
                                onClick={() => removeMedia(index)}
                                className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {item.type === 'video' && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-[10px] text-white uppercase font-bold tracking-wider">
                                    Video
                                </div>
                            )}
                        </div>
                    ))}

                    <CldUploadWidget
                        uploadPreset="ml_default"
                        options={{
                            resourceType: 'auto',  // Allow images and videos
                            multiple: true,
                            maxFiles: 6
                        }}
                        onSuccess={(result: any) => {
                            if (result.info?.secure_url) {
                                addMedia(result.info.secure_url, result.info.resource_type)
                            }
                        }}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-700 hover:border-orange-500 hover:bg-gray-800/50 transition-colors"
                            >
                                <ImagePlus className="h-8 w-8 text-gray-400" />
                                <span className="text-xs text-center text-gray-400 font-medium p-2">
                                    Add Media
                                </span>
                            </button>
                        )}
                    </CldUploadWidget>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-gray-200">
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-orange-500 focus:outline-none"
                >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                </select>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full rounded-md bg-orange-600 py-2 font-bold text-white transition-colors hover:bg-orange-500"
                >
                    Create Product
                </button>
            </div>
        </form>
    )
}
