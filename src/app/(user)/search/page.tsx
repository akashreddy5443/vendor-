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
    const maxPrice = searchParams.max_price ? Number(searchParams.max_price) : 100000

    let dbQuery = supabase
        .from('products')
        .select('*, product_images(cloudinary_url)')
        .eq('status', 'active')
        .gte('price', minPrice)
        .lte('price', maxPrice)

    if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`)
    }

    if (category !== 'all') {
        dbQuery = dbQuery.eq('category_id', category)
    }

    // Sorting
    if (sort === 'price_asc') {
        dbQuery = dbQuery.order('price', { ascending: true })
    } else if (sort === 'price_desc') {
        dbQuery = dbQuery.order('price', { ascending: false })
    } else if (sort === 'newest') {
        dbQuery = dbQuery.order('created_at', { ascending: false })
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
