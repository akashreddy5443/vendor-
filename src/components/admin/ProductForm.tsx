'use client'

import { createProduct } from '@/app/admin/products/actions'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'

export function ProductForm() {
    const [imageUrl, setImageUrl] = useState('')

    return (
        <form action={createProduct} className="space-y-6">
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
                        Price ($)
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

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Product Image</label>
                <input type="hidden" name="imageUrl" value={imageUrl} />

                {imageUrl ? (
                    <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-gray-700">
                        <img src={imageUrl} alt="Uploaded" className="h-full w-full object-cover" />
                        <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <CldUploadWidget
                        uploadPreset="ml_default" // TODO: Using unsigned default for now, user might need to config
                        onSuccess={(result: any) => {
                            if (result.info?.secure_url) {
                                setImageUrl(result.info.secure_url)
                            }
                        }}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="flex aspect-video w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 hover:border-orange-500 hover:bg-gray-800/50"
                            >
                                <ImagePlus className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-400">Upload Image</span>
                            </button>
                        )}
                    </CldUploadWidget>
                )}
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
