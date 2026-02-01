'use client'

import React, { use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/shop/ProductCard'
import { ProductCardSkeleton } from '@/components/shop/ProductCardSkeleton'
import { ProductFilterSidebarV2 } from '@/components/shop/ProductFilterSidebarV2'
import { ProductSort } from '@/components/shop/ProductSort'
import { motion, AnimatePresence } from 'framer-motion'
// ... (rest of the file content is identical to page.tsx, just changed component name export)

// I will just copy the content of page.tsx but keep the logic same.
// To save tokens I will just write the file using the previous view output.

import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
    searchParams: Promise<{
        category?: string
        brand?: string
        sort?: string
        stock?: string
        min_price?: string
        max_price?: string
        q?: string
    }>
}

export default function ProductsClient({ searchParams }: ProductPageProps) {
    const resolvedSearchParams = use(searchParams)
    const [products, setProducts] = React.useState<any[]>([])

    // Filter Metadata State
    const [brands, setBrands] = React.useState<string[]>([])
    const [categories, setCategories] = React.useState<any[]>([])
    const [priceBounds, setPriceBounds] = React.useState<{ min: number, max: number }>({ min: 0, max: 10000 })
    const [pricePresets, setPricePresets] = React.useState<any[] | undefined>(undefined)

    // Sidebar Config
    const [sidebarConfig, setSidebarConfig] = React.useState({
        categoryLabel: 'All Categories',
        brandLabel: 'Brands',
        showCategory: true,
        showBrand: true
    })

    // UI State
    const [globalDiscount, setGlobalDiscount] = React.useState(0)
    const [globalGst, setGlobalGst] = React.useState(18)
    const [loading, setLoading] = React.useState(true)
    const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false)

    React.useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()
            setLoading(true)

            // 1. Base Query for Products
            let query = supabase
                .from('products')
                .select('*, product_images(*)')
                .eq('status', 'active')

            // Apply Sort
            const sortParam = (resolvedSearchParams as any).sort || 'newest'

            if (sortParam === 'price_asc') query = query.order('price', { ascending: true })
            else if (sortParam === 'price_desc') query = query.order('price', { ascending: false })
            else query = query.order('created_at', { ascending: false })

            // Apply Filters
            if (resolvedSearchParams.category) {
                const { data: cat } = await supabase.from('categories').select('id').eq('slug', resolvedSearchParams.category).single()
                if (cat) query = query.eq('category_id', cat.id)
            }

            if ((resolvedSearchParams as any).brand) {
                const brands = (resolvedSearchParams as any).brand.split(',')
                query = query.in('brand', brands)
            }

            if ((resolvedSearchParams as any).stock === 'true') {
                query = query.gt('stock', 0)
            }

            if ((resolvedSearchParams as any).min_price) {
                query = query.gte('price', Number((resolvedSearchParams as any).min_price))
            }
            if ((resolvedSearchParams as any).max_price) {
                query = query.lte('price', Number((resolvedSearchParams as any).max_price))
            }

            if ((resolvedSearchParams as any).q) {
                query = query.ilike('title', `%${(resolvedSearchParams as any).q}%`)
            }

            const { data: productsData } = await query
            setProducts(productsData || [])

            // 2. Fetch Metadata (Scoped to current Category/Search for better context)
            let statsQuery = supabase.from('products').select('brand, price').eq('status', 'active')

            // Scope stats to category if present so filters/ranges are relevant
            if (resolvedSearchParams.category) {
                const { data: cat } = await supabase.from('categories').select('id').eq('slug', resolvedSearchParams.category).single()
                if (cat) statsQuery = statsQuery.eq('category_id', cat.id)
            }
            // Scope stats to search query if present
            if ((resolvedSearchParams as any).q) {
                statsQuery = statsQuery.ilike('title', `%${(resolvedSearchParams as any).q}%`)
            }

            const { data: allProducts } = await statsQuery

            if (allProducts) {
                const distinctBrands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean))) as string[]
                setBrands(distinctBrands.sort())
            }

            const { data: cats } = await supabase.from('categories').select('*').order('name')

            const { data: settings } = await supabase.from('site_settings').select(`
                global_discount_percentage, 
                default_gst_percentage, 
                min_price_filter, 
                max_price_filter, 
                price_presets,
                filter_category_label,
                filter_brand_label,
                show_category_filter,
                show_brand_filter,
                hidden_categories
            `).single()

            // Filter categories based on hidden_categories setting
            const hiddenCats = settings?.hidden_categories || []
            setCategories(cats?.filter(c => !hiddenCats.includes(c.slug)) || [])

            setGlobalDiscount(settings?.global_discount_percentage || 0)
            setGlobalGst(settings?.default_gst_percentage || 18)

            if (settings) {
                setPricePresets(settings.price_presets)
                setSidebarConfig({
                    categoryLabel: settings.filter_category_label || 'All Categories',
                    brandLabel: settings.filter_brand_label || 'Brands',
                    showCategory: settings.show_category_filter ?? true,
                    showBrand: settings.show_brand_filter ?? true
                })
            }

            // Dynamic Price Range from Products (Ignoring Admin Settings as requested)
            if (allProducts) {
                const prices = allProducts.map(p => p.price)
                if (prices.length > 0) {
                    setPriceBounds({
                        min: Math.floor(Math.min(...prices)),
                        max: Math.ceil(Math.max(...prices))
                    })
                }
            }
            setLoading(false)
        }
        fetchData()
    }, [resolvedSearchParams])

    return (
        <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-10">
                {/* Premium Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black font-heading text-slate-900 uppercase tracking-tight"
                    >
                        The <span className="text-primary">Collection</span>
                    </motion.h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="lg:sticky lg:top-24">
                            <ProductFilterSidebarV2
                                minPrice={priceBounds.min}
                                maxPrice={priceBounds.max}
                                brands={brands}
                                categories={categories}
                                pricePresets={pricePresets}
                                categoryLabel={sidebarConfig.categoryLabel}
                                brandLabel={sidebarConfig.brandLabel}
                                showCategory={sidebarConfig.showCategory}
                                showBrand={sidebarConfig.showBrand}
                                isOpen={mobileFiltersOpen}
                                onClose={() => setMobileFiltersOpen(false)}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Toggle & Sort */}
                        <div className="flex flex-wrap justify-between items-center mb-8 gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-wider"
                            >
                                Filters
                            </button>

                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {products?.length || 0} Products Found
                            </span>

                            <ProductSort />
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))
                            ) : (
                                <AnimatePresence mode='wait'>
                                    {products.length > 0 ? (
                                        products.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                layout
                                            >
                                                <ProductCard product={product} globalDiscount={globalDiscount} globalGst={globalGst} />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                                            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest font-heading mb-2">No Matches</h3>
                                            <p className="text-slate-500 text-sm font-medium">Try resetting your filters or adjusting criteria.</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
