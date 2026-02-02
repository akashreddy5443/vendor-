import { createClient } from '@/lib/supabase/server'
import { ProductCard } from './ProductCard'

export async function SimilarProducts({ categoryId, currentProductId, globalDiscount, globalGst }: { categoryId: string, currentProductId: string, globalDiscount: number, globalGst?: number }) {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select(`
            *,
            product_images(
                cloudinary_url,
                is_primary
            )
        `)
        .eq('category_id', categoryId)
        .neq('id', currentProductId)
        .limit(4)

    if (!products || products.length === 0) return null

    return (
        <section className="py-12 border-t border-slate-100">
            <h2 className="text-2xl font-black font-heading mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} globalDiscount={globalDiscount} globalGst={globalGst} />
                ))}
            </div>
        </section>
    )
}
