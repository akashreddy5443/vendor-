import { createClient } from '@/lib/supabase/server'
import { ProductCard } from './ProductCard'

export async function SimilarProducts({ categoryId, currentProductId }: { categoryId: string, currentProductId: string }) {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select(`
            *,
            product_images (
                cloudinary_url,
                is_primary
            ),
            categories (
                name,
                slug
            )
        `)
        .eq('category_id', categoryId)
        .neq('id', currentProductId)
        .limit(4)

    if (!products || products.length === 0) return null

    return (
        <section className="py-12 border-t border-gray-100 mt-12 bg-gray-50/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
