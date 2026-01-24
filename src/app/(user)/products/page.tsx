import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/ProductCard'

export const metadata = {
    title: 'All Products | TechDev Store',
    description: 'Browse our collection of premium developer gear.',
}

export default async function ProductsPage() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-serif mb-4">All Products</h1>
                        <p className="text-gray-400 max-w-xl">
                            Explore our curated collection of high-quality gear designed for your setup.
                        </p>
                    </div>
                    {/* Future: Sort/Filter Controls */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
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
