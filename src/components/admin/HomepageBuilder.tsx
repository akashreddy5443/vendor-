'use client'

import { updateHero, updateFeatured } from '@/app/admin/homepage/actions' // We'll add updateFeatured
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, X, Check } from 'lucide-react'
import { useState } from 'react'

type Product = {
    id: string
    title: string
    price: number
    status: string
}

type HomepageBuilderProps = {
    products: Product[]
    heroSection: any
    featuredSection: any
}

export function HomepageBuilder({ products, heroSection, featuredSection }: HomepageBuilderProps) {
    // Hero State
    const [heroImage, setHeroImage] = useState(heroSection?.content_json?.imageUrl || '')

    // Featured State
    const initialSelected = featuredSection?.content_json?.productIds || []
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialSelected)

    const handleHeroSubmit = async (formData: FormData) => {
        await updateHero(formData)
    }

    const handleFeaturedSubmit = async (formData: FormData) => {
        // We need to append the JSON product IDs manually or use a hidden input structure
        // Better: use a bind or directly call server action with data, but form action is cleanest if we serialize
        // Let's use hidden input for simplicity with formData
        await updateFeatured(formData)
    }

    const toggleProduct = (id: string) => {
        setSelectedProductIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        )
    }

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Homepage Builder</h2>
                <p className="text-gray-400">Manage your homepage content.</p>
            </div>

            {/* Hero Section Editor */}
            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-xl font-bold text-blue-500">Hero Section</h3>
                <form action={handleHeroSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Main Headline</label>
                        <input
                            name="title"
                            defaultValue={heroSection?.title}
                            placeholder="LEVEL UP YOUR SETUP"
                            className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Subtitle</label>
                        <textarea
                            name="subtitle"
                            defaultValue={heroSection?.subtitle}
                            rows={3}
                            placeholder="Premium gear for developers..."
                            className="w-full rounded-md border border-gray-700 bg-gray-950 p-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Background Image</label>
                        <input type="hidden" name="imageUrl" value={heroImage} />

                        {heroImage ? (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-700">
                                <img src={heroImage} alt="Hero Background" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setHeroImage('')}
                                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <CldUploadWidget
                                uploadPreset="ml_default"
                                onSuccess={(result: any) => {
                                    if (result.info?.secure_url) {
                                        setHeroImage(result.info.secure_url)
                                    }
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 hover:border-blue-500 hover:bg-gray-800/50"
                                    >
                                        <ImagePlus className="h-8 w-8 text-gray-400" />
                                        <span className="text-sm text-gray-400">Upload Hero Image</span>
                                    </button>
                                )}
                            </CldUploadWidget>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-500"
                        >
                            Update Hero
                        </button>
                    </div>
                </form>
            </section>

            {/* Featured Products Editor */}
            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-xl font-bold text-blue-500">Featured Products</h3>
                <p className="mb-4 text-sm text-gray-400">Select products to display on the homepage (Max 3-6 recommended).</p>

                <form action={handleFeaturedSubmit} className="space-y-6">
                    <input type="hidden" name="productIds" value={JSON.stringify(selectedProductIds)} />

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto p-2 border border-gray-800 rounded-md">
                        {products.map((product) => {
                            const isSelected = selectedProductIds.includes(product.id)
                            return (
                                <div
                                    key={product.id}
                                    onClick={() => toggleProduct(product.id)}
                                    className={`cursor-pointer rounded-lg border p-3 transition-colors flex items-center justify-between ${isSelected
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                                        }`}
                                >
                                    <span className="text-sm font-medium text-white truncate">{product.title}</span>
                                    {isSelected && <Check className="h-4 w-4 text-blue-500" />}
                                </div>
                            )
                        })}
                        {products.length === 0 && <div className="text-gray-500 text-sm p-2">No products available. Add some products first.</div>}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-500"
                        >
                            Update Featured
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
