import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/shop/ProductCard'
import { ProductListCard } from '@/components/shop/ProductListCard'
import { FilterSidebar } from './FilterSidebar'
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
        // Fallback: If param exists but lookup failed, maybe force 0 results or ignore?
        // If we don't filter, we show ALL products which is confusing.
        // Let's force a non-match if category was requested but invalid
        dbQuery = dbQuery.eq('id', '00000000-0000-0000-0000-000000000000')
    }

    // Sorting
    if (sort === 'price_asc') {
        dbQuery = dbQuery.order('price', { ascending: true })
    } else if (sort === 'price_desc') {
        dbQuery = dbQuery.order('price', { ascending: false })
    } else if (sort === 'newest') { // Fix "newest" sorting key
        dbQuery = dbQuery.order('created_at', { ascending: false })
    } else {
        // Default sort (relevance/none)
    }

    const { data: products } = await dbQuery

    // Fetch Categories for Filter
    const { data: categories } = await supabase.from('categories').select('id, name, slug').order('name')

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <SearchHeader query={query} total={products?.length || 0} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
                        <FilterSidebar categories={categories || []} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
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
