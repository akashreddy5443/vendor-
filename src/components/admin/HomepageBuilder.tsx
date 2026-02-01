'use client'

import { updateHero, updateFeatured, updateCategories, updateFooter, updateHeroSlider } from '@/app/admin/homepage/actions'
import { CldUploadWidget } from 'next-cloudinary'
import { ImagePlus, X, Check, Trash2, Plus, GripVertical, ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import { LifestyleEditor } from '@/components/admin/LifestyleEditor'
import { TrendingEditor } from '@/components/admin/TrendingEditor'
import { PromoGridEditor } from '@/components/admin/PromoGridEditor'
import { FooterEditor } from '@/components/admin/FooterEditor'

type Product = {
    id: string
    title: string
    price: number
    status: string
}

type Slide = {
    id: string
    title: string
    subtitle: string
    imageUrl: string
    buttonText: string
    link: string
}

type HomepageBuilderProps = {
    products: Product[]
    heroSection: any
    featuredSection: any
    categoriesSection: any
    footerSection: any
    sliderSection: any
    lifestyleSection: any
    trendingSection: any
    promoSection: any
}

export function HomepageBuilder({ products, heroSection, featuredSection, categoriesSection, footerSection, sliderSection, lifestyleSection, trendingSection, promoSection }: HomepageBuilderProps) {
    // ... Existing state logic ...
    // Hero State
    const [heroImage, setHeroImage] = useState(heroSection?.content_json?.imageUrl || '')

    // Slider State
    const [slides, setSlides] = useState<Slide[]>(sliderSection?.content_json?.slides || [
        { id: '1', title: 'Level Up Your Setup', subtitle: 'Premium Gear', imageUrl: '', buttonText: 'Shop Now', link: '/products' }
    ])

    // Categories State
    const [categories, setCategories] = useState<any[]>(() => {
        let cats = categoriesSection?.content_json?.categories || [
            { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', href: '/search?category=laptops' },
            { name: 'Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', href: '/search?category=phones' },
            { name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', href: '/search?category=audio' },
            { name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', href: '/search?category=wearables' },
            { name: 'Gaming', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e', href: '/search?category=gaming' },
            { name: 'Accessories', image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f', href: '/search?category=accessories' },
        ];

        // Auto-fix: Ensure "All Categories" exists with image
        if (!cats.find((c: any) => c.name === 'All Categories')) {
            cats = [...cats, { name: 'All Categories', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f', href: '/products' }]
        }

        return cats
    })

    // Featured State
    const initialSelected = featuredSection?.content_json?.productIds || []
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialSelected)
    const [featuredTitle, setFeaturedTitle] = useState(featuredSection?.title || 'Featured Gear')
    const [featuredSubtitle, setFeaturedSubtitle] = useState(featuredSection?.content_json?.subtitle || "Editor's Choice")

    const handleHeroSubmit = async (formData: FormData) => {
        await updateHero(formData)
    }

    const handleSliderSubmit = async (formData: FormData) => {
        // Append slides JSON to formData
        formData.append('slides', JSON.stringify(slides))
        await updateHeroSlider(formData)
    }

    const handleFeaturedSubmit = async (formData: FormData) => {
        // We need to append the JSON product IDs manually or use a hidden input structure
        formData.append('title', featuredTitle)
        formData.append('subtitle', featuredSubtitle)
        await updateFeatured(formData)
    }

    const handleCategoriesSubmit = async (formData: FormData) => {
        await updateCategories(formData)
    }

    const handleFooterSubmit = async (formData: FormData) => {
        await updateFooter(formData)
    }

    const addCategory = () => {
        setCategories([...categories, { name: 'New Unit', image: '', href: '/products' }])
    }

    // Slider Helpers
    const addSlide = () => {
        const newSlide: Slide = {
            id: Date.now().toString(),
            title: 'New Headline',
            subtitle: 'Subtitle',
            imageUrl: '',
            buttonText: 'Shop Now',
            link: '/products'
        }
        setSlides([...slides, newSlide])
    }

    const updateSlide = (index: number, field: keyof Slide, value: string) => {
        const newSlides = [...slides]
        newSlides[index] = { ...newSlides[index], [field]: value }
        setSlides(newSlides)
    }

    const removeSlide = (index: number) => {
        const newSlides = [...slides]
        newSlides.splice(index, 1)
        setSlides(newSlides)
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
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Homepage Builder</h2>
                <p className="text-gray-500">Manage your homepage content.</p>
            </div>

            {/* Hero Slider Editor */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-bold text-green-600 flex items-center gap-2">
                    <ImagePlus className="w-5 h-5" /> Hero Slider (Promo)
                </h3>
                <form action={handleSliderSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {slides.map((slide, index) => (
                            <div key={slide.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-sm font-bold text-gray-700">Slide #{index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeSlide(index)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <input
                                            value={slide.title}
                                            onChange={(e) => updateSlide(index, 'title', e.target.value)}
                                            placeholder="Headline"
                                            className="w-full rounded bg-white border border-gray-300 p-2 text-gray-900 text-sm focus:border-blue-500 outline-none"
                                        />
                                        <input
                                            value={slide.subtitle}
                                            onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                                            placeholder="Subtitle"
                                            className="w-full rounded bg-white border border-gray-300 p-2 text-gray-900 text-sm focus:border-blue-500 outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                value={slide.buttonText}
                                                onChange={(e) => updateSlide(index, 'buttonText', e.target.value)}
                                                placeholder="Button Text"
                                                className="w-1/2 rounded bg-white border border-gray-300 p-2 text-gray-900 text-sm focus:border-blue-500 outline-none"
                                            />
                                            <input
                                                value={slide.link}
                                                onChange={(e) => updateSlide(index, 'link', e.target.value)}
                                                placeholder="Link"
                                                className="w-1/2 rounded bg-white border border-gray-300 p-2 text-gray-900 text-sm focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="relative aspect-video bg-gray-100 rounded border border-gray-200 overflow-hidden flex items-center justify-center group">
                                        {slide.imageUrl ? (
                                            <>
                                                <img src={slide.imageUrl} alt="Slide" className="w-full h-full object-contain" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <CldUploadWidget
                                                        uploadPreset="ml_default"
                                                        onSuccess={(result: any) => updateSlide(index, 'imageUrl', result.info.secure_url)}
                                                    >
                                                        {({ open }) => (
                                                            <button type="button" onClick={() => open()} className="bg-white text-black px-3 py-1 rounded text-xs font-bold shadow-sm hover:bg-gray-100">
                                                                Change
                                                            </button>
                                                        )}
                                                    </CldUploadWidget>
                                                </div>
                                            </>
                                        ) : (
                                            <CldUploadWidget
                                                uploadPreset="ml_default"
                                                onSuccess={(result: any) => updateSlide(index, 'imageUrl', result.info.secure_url)}
                                            >
                                                {({ open }) => (
                                                    <button type="button" onClick={() => open()} className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                                                        <ImagePlus className="w-8 h-8 mb-2" />
                                                        <span className="text-xs">Upload Image</span>
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between">
                        <button type="button" onClick={addSlide} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                            <Plus className="w-4 h-4" /> Add Slide
                        </button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors">
                            Save Slider
                        </button>
                    </div>
                </form>
            </section>

            {/* Old Hero Section Editor (Collapsed or Deprecated visual) */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 opacity-60 hover:opacity-100 transition-opacity">
                <h3 className="mb-4 text-xl font-bold text-gray-400">Static Hero (Legacy)</h3>
                <form action={handleHeroSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Main Headline</label>
                        <input
                            name="title"
                            defaultValue={heroSection?.title}
                            placeholder="LEVEL UP YOUR SETUP"
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Subtitle</label>
                        <textarea
                            name="subtitle"
                            defaultValue={heroSection?.subtitle}
                            rows={3}
                            placeholder="Premium gear for developers..."
                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Background Image</label>
                        <input type="hidden" name="imageUrl" value={heroImage} />

                        {heroImage ? (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                                <img src={heroImage} alt="Hero Background" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setHeroImage('')}
                                    className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-red-600 hover:bg-white shadow-sm"
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
                                        className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 hover:border-blue-500 hover:bg-gray-50 transition-colors"
                                    >
                                        <ImagePlus className="h-8 w-8 text-gray-400" />
                                        <span className="text-sm text-gray-500">Upload Hero Image</span>
                                    </button>
                                )}
                            </CldUploadWidget>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
                        >
                            Update Hero
                        </button>
                    </div>
                </form>
            </section>

            {/* Featured Products Editor */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-bold text-blue-600">Featured Products</h3>
                <p className="mb-4 text-sm text-gray-500">Select products to display on the homepage (Max 3-6 recommended).</p>

                <form action={handleFeaturedSubmit} className="space-y-6">
                    <input type="hidden" name="productIds" value={JSON.stringify(selectedProductIds)} />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Section Title</label>
                            <input value={featuredTitle} onChange={(e) => setFeaturedTitle(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 outline-none" placeholder="Featured Gear" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tagline / Subtitle</label>
                            <input value={featuredSubtitle} onChange={(e) => setFeaturedSubtitle(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-blue-500 outline-none" placeholder="Editor's Choice" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-md bg-gray-50">
                        {products.map((product) => {
                            const isSelected = selectedProductIds.includes(product.id)
                            return (
                                <div
                                    key={product.id}
                                    onClick={() => toggleProduct(product.id)}
                                    className={`cursor-pointer rounded-lg border p-3 transition-colors flex items-center justify-between ${isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-sm font-medium text-gray-900 truncate">{product.title}</span>
                                    {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                                </div>
                            )
                        })}
                        {products.length === 0 && <div className="text-gray-500 text-sm p-2">No products available. Add some products first.</div>}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
                        >
                            Update Featured
                        </button>
                    </div>
                </form>
            </section>
            {/* Categories Editor (AJIO-Style Tiles) */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5" /> Browse Categories (Tiles)
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">Manage the image-based category tiles on your homepage.</p>
                    </div>
                    <button
                        onClick={addCategory}
                        className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> Add Tile
                    </button>
                </div>

                <form action={handleCategoriesSubmit} className="space-y-6">
                    <input type="hidden" name="categories" value={JSON.stringify(categories)} key={JSON.stringify(categories)} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((cat, index) => (
                            <div key={index} className="flex flex-col gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeCategory(index)}
                                    className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full text-red-500 shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>

                                <div className="flex gap-4 items-start">
                                    {/* Image Selector */}
                                    <div className="relative h-24 w-20 shrink-0 rounded-xl bg-white border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center">
                                        {cat.image ? (
                                            <>
                                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <CldUploadWidget
                                                        uploadPreset="ml_default"
                                                        onSuccess={(result: any) => updateCategory(index, 'image', result.info.secure_url)}
                                                    >
                                                        {({ open }) => (
                                                            <button type="button" onClick={() => open()} className="text-[9px] font-black text-white uppercase tracking-widest px-2 py-1 bg-white/20 rounded backdrop-blur-sm border border-white/20">
                                                                Swap
                                                            </button>
                                                        )}
                                                    </CldUploadWidget>
                                                </div>
                                            </>
                                        ) : (
                                            <CldUploadWidget
                                                uploadPreset="ml_default"
                                                onSuccess={(result: any) => updateCategory(index, 'image', result.info.secure_url)}
                                            >
                                                {({ open }) => (
                                                    <button type="button" onClick={() => open()} className="flex flex-col items-center text-gray-400 hover:text-indigo-600">
                                                        <ImagePlus className="w-6 h-6 mb-1" />
                                                        <span className="text-[10px] font-black uppercase">Cover</span>
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        )}
                                    </div>

                                    {/* Fields */}
                                    <div className="flex-1 space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Name</label>
                                            <input
                                                value={cat.name}
                                                onChange={(e) => updateCategory(index, 'name', e.target.value)}
                                                className="w-full rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-900 outline-none focus:border-indigo-500 shadow-sm"
                                                placeholder="e.g. Laptops"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Redirection Href</label>
                                            <input
                                                value={cat.href}
                                                onChange={(e) => updateCategory(index, 'href', e.target.value)}
                                                className="w-full rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-500 outline-none focus:border-indigo-500 shadow-sm"
                                                placeholder="/search?category=..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            className="rounded-xl bg-indigo-600 px-8 py-3 font-black text-white transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 text-xs uppercase tracking-widest"
                        >
                            Sync Category Logic
                        </button>
                    </div>
                </form>
            </section>

            {/* Footer Settings Editor */}
            <FooterEditor initialConfig={footerSection?.content_json} />

            {/* Lifestyle Grid Editor */}
            <LifestyleEditor initialItems={lifestyleSection?.content_json?.items} />

            {/* Trending Spotlight Editor */}
            <TrendingEditor initialData={trendingSection?.content_json} />

            {/* Promo Grid Editor */}
            <PromoGridEditor initialCards={promoSection?.content_json?.cards} />
        </div>
    )
}
