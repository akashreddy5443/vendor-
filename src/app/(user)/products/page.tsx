import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/ProductCard'

export const metadata = {
    title: 'All Products | TechDev Store',
    description: 'Browse our collection of premium developer gear.',
}

export const dynamic = 'force-dynamic'

interface ProductPageProps {
    searchParams: {
        category?: string
    }
}

export default async function ProductsPage({ searchParams }: ProductPageProps) {
    const supabase = await createClient()

    let query = supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    if (searchParams.category && searchParams.category !== 'all') {
        console.log('[Products] Category Filter Slug:', searchParams.category)
        // Resolve slug to ID
        const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', searchParams.category)
            .single()

        console.log('[Products] Resolved Category ID:', categoryData?.id)

        if (categoryData) {
            query = query.eq('category_id', categoryData.id)
        }
    }

    const { data: products } = await query

    // Fetch Global Settings
    const { data: settings } = await supabase.from('site_settings').select('global_discount_percentage, default_gst_percentage').single()
    const globalDiscount = settings?.global_discount_percentage || 0
    const globalGst = settings?.default_gst_percentage || 18

    return (
        <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-serif mb-4">All Products</h1>
                        <p className="text-muted-foreground max-w-xl">
                            Explore our curated collection of high-quality gear designed for your setup.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} globalDiscount={globalDiscount} globalGst={globalGst} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <h3 className="text-xl font-medium text-gray-300">No products found.</h3>
                            <p className="text-gray-500 mt-2">Check back later for new arrivals.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
