'use client'

import { updateHero, updateFeatured, updateCategories } from '@/app/admin/homepage/actions'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, X, Check, Trash2, Plus, GripVertical } from 'lucide-react'
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
    categoriesSection: any
}

export function HomepageBuilder({ products, heroSection, featuredSection, categoriesSection }: HomepageBuilderProps) {
    // Hero State
    const [heroImage, setHeroImage] = useState(heroSection?.content_json?.imageUrl || '')

    // Categories State
    const [categories, setCategories] = useState<any[]>(categoriesSection?.content_json?.categories || [
        { name: 'Laptops', icon: '💻', href: '/search?category=laptops' },
        { name: 'Phones', icon: '📱', href: '/search?category=phones' },
        { name: 'Audio', icon: '🎧', href: '/search?category=audio' },
        { name: 'Watches', icon: '⌚', href: '/search?category=wearables' },
        { name: 'Gaming', icon: '🎮', href: '/search?category=gaming' },
        { name: 'Cameras', icon: '📷', href: '/search?category=cameras' },
    ])

    // Featured State
    const initialSelected = featuredSection?.content_json?.productIds || []
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialSelected)

    const handleHeroSubmit = async (formData: FormData) => {
        await updateHero(formData)
    }

    const handleFeaturedSubmit = async (formData: FormData) => {
        // We need to append the JSON product IDs manually or use a hidden input structure
        await updateFeatured(formData)
    }

    const handleCategoriesSubmit = async (formData: FormData) => {
        await updateCategories(formData)
    }

    const addCategory = () => {
        setCategories([...categories, { name: 'New Category', icon: '📦', href: '/search?category=new' }])
    }

    const removeCategory = (index: number) => {
        const newCats = [...categories]
        newCats.splice(index, 1)
        setCategories(newCats)
    }

    const updateCategory = (index: number, field: string, value: string) => {
        const newCats = [...categories]
        newCats[index] = { ...newCats[index], [field]: value }
        setCategories(newCats)
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
            {/* Categories Editor */}
            <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-blue-500">Shop by Category</h3>
                        <p className="text-sm text-gray-400">Edit the circular category links on the homepage.</p>
                    </div>
                    <button
                        type="button"
                        onClick={addCategory}
                        className="flex items-center gap-2 rounded-md bg-blue-600/10 px-3 py-1.5 text-sm font-medium text-blue-400 hover:bg-blue-600/20"
                    >
                        <Plus className="h-4 w-4" /> Add Category
                    </button>
                </div>

                <form action={handleCategoriesSubmit} className="space-y-6">
                    <input type="hidden" name="categories" value={JSON.stringify(categories)} />

                    <div className="space-y-4">
                        {categories.map((cat, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-950 p-4 rounded-lg border border-gray-800">
                                <div className="flex-1 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 w-full">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Name</label>
                                        <input
                                            value={cat.name}
                                            onChange={(e) => updateCategory(index, 'name', e.target.value)}
                                            className="w-full rounded bg-black border border-gray-700 p-2 text-sm text-white"
                                            placeholder="Laptops"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Icon (Emoji)</label>
                                        <input
                                            value={cat.icon}
                                            onChange={(e) => updateCategory(index, 'icon', e.target.value)}
                                            className="w-full rounded bg-black border border-gray-700 p-2 text-sm text-white"
                                            placeholder="💻"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Link URL</label>
                                        <input
                                            value={cat.href}
                                            onChange={(e) => updateCategory(index, 'href', e.target.value)}
                                            className="w-full rounded bg-black border border-gray-700 p-2 text-sm text-white"
                                            placeholder="/search?category=..."
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCategory(index)}
                                    className="p-2 text-gray-500 hover:text-red-500 mt-4 sm:mt-0"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-500"
                        >
                            Update Categories
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
