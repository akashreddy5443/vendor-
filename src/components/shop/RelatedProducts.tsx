import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ProductCard } from '@/components/shop/ProductCard'

interface RelatedProductsProps {
    categoryId: string
    currentId: string
}

export async function RelatedProducts({ categoryId, currentId }: RelatedProductsProps) {
    if (!categoryId) return null

    const supabase = await createClient()

    // Fetch up to 4 products from the same category, excluding the current one
    // Note: 'random' ordering is strict in SQL, for small scale 'limit 4' is practically fine.
    // Enhanced Approach: If huge DB, use RPC. For now simple query is OK.
    const { data: products } = await supabase
        .from('products')
        .select('*, product_images(cloudinary_url, is_primary)')
        .eq('category_id', categoryId)
        .neq('id', currentId)
        .eq('status', 'active')
        .limit(4)

    if (!products || products.length === 0) return null

    return (
        <div className="mt-20">
            <h2 className="text-2xl font-bold font-serif mb-8 text-white">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
