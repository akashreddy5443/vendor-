import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/shop/ProductCard'
import { FilterSidebar } from './FilterSidebar'
import { SortSelect } from './SortSelect'
import { MobileFilter } from './MobileFilter'
import { SearchHeader } from './SearchHeader'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const supabase = createClient()
    const query = searchParams.q as string || ''
    const category = searchParams.category as string || 'all'
    const sort = searchParams.sort as string || 'relevance'
    const minPrice = searchParams.min_price ? Number(searchParams.min_price) : 0
    // Fix: Don't set an arbitrary default max price, allow infinity if not set
    const maxPrice = searchParams.max_price ? Number(searchParams.max_price) : null

    console.log('[Search] Params:', { query, category, minPrice, maxPrice })

    // Resolve Category Slug to ID
    let categoryId = ''
    if (category !== 'all') {
        const { data: catData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', category)
            .single()

        if (catData) {
            categoryId = catData.id
            console.log('[Search] Resolved Category:', category, '->', categoryId)
        } else {
            // If category provided but not found, maybe it's already an ID? or invalid. 
            // Try valid UUID check or ignore. For now, assume slug.
        }
    }

    let dbQuery = supabase
        .from('products')
        .select('*, product_images(cloudinary_url)')
        .eq('status', 'active')

    // Price Filters
    if (minPrice > 0) {
        dbQuery = dbQuery.gte('price', minPrice)
    }
    if (maxPrice !== null && maxPrice > 0) {
        dbQuery = dbQuery.lte('price', maxPrice)
    }

    // Text Search
    if (query) {
        dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
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
    const { data: categories } = await supabase.from('categories').select('id, name').order('name')

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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
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
