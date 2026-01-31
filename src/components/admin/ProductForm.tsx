'use client'

import { createProduct, updateProduct } from '@/app/admin/products/actions'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'

interface ProductFormProps {
    categories?: { id: string, name: string }[]
    initialData?: {
        id: string
        title: string
        description?: string
        price: number
        stock: number
        discount_percentage?: number | null
        gst_percentage?: number | null
        status: string
        category_id?: string
        brand?: string
        features?: any // JSONB
        product_images?: { cloudinary_url: string, media_type: string }[]
    }
}

export function ProductForm({ categories = [], initialData }: ProductFormProps) {
    const [media, setMedia] = useState<{ url: string, type: 'image' | 'video' }[]>(
        initialData?.product_images?.map(img => ({
            url: img.cloudinary_url,
            type: (img.media_type === 'video' ? 'video' : 'image')
        })) || []
    )

    const addMedia = (url: string, type: string) => {
        const mediaType = type === 'video' ? 'video' : 'image'
        setMedia(prev => [...prev, { url, type: mediaType }])
    }

    const removeMedia = (index: number) => {
        setMedia(prev => prev.filter((_, i) => i !== index))
    }

    // Features State
    const [features, setFeatures] = useState<{ key: string, value: string }[]>(
        initialData?.features && Array.isArray(initialData.features)
            ? initialData.features
            : []
    )

    const addFeature = () => {
        setFeatures([...features, { key: '', value: '' }])
    }

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index))
    }

    const updateFeature = (index: number, field: 'key' | 'value', text: string) => {
        const newFeatures = [...features]
        newFeatures[index][field] = text
        setFeatures(newFeatures)
    }

    const handleSubmit = async (formData: FormData) => {
        if (initialData) {
            formData.append('id', initialData.id)
            await updateProduct(formData)
        } else {
            await createProduct(formData)
        }
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
                        defaultValue={initialData?.title}
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. LTT Screwdriver"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="brand" className="text-sm font-medium text-gray-200">
                        Brand
                    </label>
                    <input
                        id="brand"
                        name="brand"
                        defaultValue={initialData?.brand || ""}
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. Logitech"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="category_id" className="text-sm font-medium text-gray-200">
                    Category
                </label>
                <select
                    id="category_id"
                    name="category_id"
                    defaultValue={initialData?.category_id || ""}
                    className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                >
                    <option value="">Select a Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-200">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={initialData?.description}
                    className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Product details..."
                />
            </div>

            {/* Features / Specifications Editor */}
            <div className="space-y-4 rounded-lg border border-gray-800 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-200">Specifications / Features</label>
                    <button
                        type="button"
                        onClick={addFeature}
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                        + Add Feature
                    </button>
                </div>
                <input type="hidden" name="features" value={JSON.stringify(features)} />

                {features.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No features added (e.g. Processor, RAM, Material)</p>
                )}

                <div className="space-y-2">
                    {features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Key (e.g. Color)"
                                value={feature.key}
                                onChange={(e) => updateFeature(index, 'key', e.target.value)}
                                className="flex-1 rounded-md border border-gray-700 bg-gray-950 p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Value (e.g. Black)"
                                value={feature.value}
                                onChange={(e) => updateFeature(index, 'value', e.target.value)}
                                className="flex-1 rounded-md border border-gray-700 bg-gray-950 p-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="p-2 text-red-500 hover:text-red-400"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
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
                        defaultValue={initialData?.price}
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="0.00"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Format: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(initialData?.price || 0)}
                    </p>
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
                        defaultValue={initialData?.stock ?? 0}
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="discount_percentage" className="text-sm font-medium text-gray-200">
                        Discount (%) <span className="text-xs text-gray-500">(Optional override)</span>
                    </label>
                    <input
                        id="discount_percentage"
                        name="discount_percentage"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        defaultValue={initialData?.discount_percentage ?? ''}
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Leave empty to use Global"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="gst_percentage" className="text-sm font-medium text-gray-200">
                        GST Rate (%) <span className="text-xs text-gray-500">(Optional override)</span>
                    </label>
                    <input
                        id="gst_percentage"
                        name="gst_percentage"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        defaultValue={initialData?.gst_percentage ?? ''}
                        className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Leave empty to use Global (18%)"
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
                            resourceType: 'auto',
                            multiple: true,
                            maxFiles: 6,
                            cropping: true,
                            croppingAspectRatio: 0.75, // 3:4 Portrait aspect ratio to match card
                            showSkipCropButton: false,
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
                                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-700 hover:border-blue-500 hover:bg-gray-800/50 transition-colors"
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
                    defaultValue={initialData?.status || "active"}
                    className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                </select>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 py-2 font-bold text-white transition-colors hover:bg-blue-500"
                >
                    {initialData ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    )
}
