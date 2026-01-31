import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/shop/ProductCard'
import { ProductListCard } from '@/components/shop/ProductListCard'
import { ProductFilterSidebarV2 } from '@/components/shop/ProductFilterSidebarV2'
import { SortSelect } from './SortSelect'
import { MobileFilter } from './MobileFilter'
import { SearchHeader } from './SearchHeader'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = await searchParams
    const supabase = createClient()
    const query = (resolvedParams.q as string) || ''
    const category = (resolvedParams.category as string) || 'all'
    const sort = (resolvedParams.sort as string) || 'relevance'
    const minPrice = resolvedParams.min_price ? Number(resolvedParams.min_price) : 0
    // Fix: Don't set an arbitrary default max price, allow infinity if not set
    const maxPrice = resolvedParams.max_price ? Number(resolvedParams.max_price) : null

    console.log('[Search] Params:', { query, category, minPrice, maxPrice })

    // Resolve Category Slug or ID
    let categoryId = ''
    if (category !== 'all') {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category)

        if (isUuid) {
            categoryId = category
        } else {
            const { data: catData } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', category)
                .single()

            if (catData) {
                categoryId = catData.id
            }
        }
        console.log('[Search] Resolved Category:', category, '->', categoryId)
    }

    let dbQuery = supabase
        .from('products')
        .select('*, product_images(cloudinary_url)')
        .eq('status', 'active')

    // Text Search (Apply first to ensure binding)
    if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    }

    // Price Filters
    if (minPrice > 0) {
        dbQuery = dbQuery.gte('price', minPrice)
    }
    if (maxPrice !== null && maxPrice > 0) {
        dbQuery = dbQuery.lte('price', maxPrice)
    }

    // Category Filter
    if (categoryId) {
        dbQuery = dbQuery.eq('category_id', categoryId)
    } else if (category !== 'all') {
        dbQuery = dbQuery.eq('id', '00000000-0000-0000-0000-000000000000')
    }

    // Sorting
    if (sort === 'price_asc') {
        dbQuery = dbQuery.order('price', { ascending: true })
    } else if (sort === 'price_desc') {
        dbQuery = dbQuery.order('price', { ascending: false })
    } else if (sort === 'newest') {
        dbQuery = dbQuery.order('created_at', { ascending: false })
    } else {
        // Default sort (relevance/none)
    }

    const { data: products } = await dbQuery

    // Fetch Metadata for Filters (Brands, Prices, Categories)
    // 1. Categories
    const { data: categories } = await supabase.from('categories').select('id, name, slug').order('name')

    // 2. All Active Products (for Brands & Price Range)
    // In a real large-scale app, this should be a dedicated RPC or cached aggregation
    const { data: allProducts } = await supabase.from('products').select('brand, price').eq('status', 'active')

    let brands: string[] = []
    if (allProducts) {
        brands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean))) as string[]
        brands.sort()
    }

    // 3. Site Settings for Price Limits & Discount
    const { data: settings } = await supabase.from('site_settings').select(`
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
    const visibleCategories = categories?.filter(c => !hiddenCats.includes(c.slug)) || []

    let priceBounds = { min: 0, max: 10000 } // Fallout default

    if (settings?.max_price_filter) {
        priceBounds = {
            min: settings.min_price_filter || 0,
            max: settings.max_price_filter
        }
    } else if (allProducts) {
        // Prices fallback
        const prices = allProducts.map(p => p.price)
        if (prices.length > 0) {
            priceBounds = {
                min: 0,
                max: Math.ceil(Math.max(...prices))
            }
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <SearchHeader query={query} total={products?.length || 0} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
                        <ProductFilterSidebarV2
                            minPrice={priceBounds.min}
                            maxPrice={priceBounds.max}
                            brands={brands}
                            categories={visibleCategories || []}
                            pricePresets={settings?.price_presets}
                            categoryLabel={settings?.filter_category_label || 'All Categories'}
                            brandLabel={settings?.filter_brand_label || 'Brands'}
                            showCategory={settings?.show_category_filter ?? true}
                            showBrand={settings?.show_brand_filter ?? true}
                            isOpen={false} // Desktop always visible via CSS 'hidden lg:block'
                        // onClose is optional
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            {/* We might want to fix MobileFilter later too, but prioritizing Desktop */}
                            <MobileFilter categories={categories || []} />
                            <SortSelect />
                        </div>

                        {products && products.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {products.map((product) => (
                                    <ProductListCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                <p className="text-xl font-medium text-gray-300">No products found</p>
                                <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
