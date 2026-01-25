import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { AddToCart } from '@/components/shop/AddToCart'
import { formatPrice } from '@/lib/utils'
import { ReviewForm } from '@/components/shop/ReviewForm'
import { ReviewsList } from '@/components/shop/ReviewsList'
import { RelatedProducts } from '@/components/shop/RelatedProducts'
import { ProductQA } from '@/components/shop/ProductQA'

interface PageProps {
    params: {
        id: string
    }
}

// Dynamic Metadata
export async function generateMetadata({ params }: PageProps) {
    const supabase = await createClient()
    const { data: product } = await supabase
        .from('products')
        .select('title')
        .eq('id', params.id)
        .single()

    return {
        title: product ? `${product.title} | TechDev Store` : 'Product Not Found',
    }
}

export default async function ProductDetailPage({ params }: PageProps) {
    const supabase = await createClient()

    // Fetch Product with Images
    const { data: product } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', params.id)
        .single()

    if (!product) {
        notFound()
    }

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left Column: Gallery */}
                    <div>
                        <ProductGallery images={product.product_images || []} />
                    </div>

                    {/* Right Column: Info */}
                    <div className="space-y-8">
                        <div>
                            {/* Stock Status Badge */}
                            {product.stock === 0 ? (
                                <span className="inline-block rounded bg-zinc-800 px-3 py-1 text-sm font-bold text-gray-400 mb-2 border border-zinc-700">
                                    Out of Stock
                                </span>
                            ) : product.stock <= 5 ? (
                                <span className="inline-block rounded bg-red-900/30 px-3 py-1 text-sm font-bold text-red-500 mb-2 border border-red-500/20 animate-pulse">
                                    Only {product.stock} Left in Stock!
                                </span>
                            ) : (
                                <span className="inline-block rounded bg-green-900/20 px-3 py-1 text-sm font-bold text-green-500 mb-2 border border-green-500/20">
                                    In Stock
                                </span>
                            )}

                            <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-2">
                                {product.title}
                            </h1>
                            {/* Category Label (Future) */}
                            {/* <span className="inline-block rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">Electronics</span> */}
                        </div>

                        <div className="text-3xl font-medium text-orange-500">
                            {formatPrice(product.price)}
                        </div>

                        <div className="prose prose-invert prose-lg text-gray-400">
                            <p>{product.description || "No description available."}</p>
                        </div>

                        <div className="border-t border-gray-800 pt-8">
                            <AddToCart
                                productId={product.id}
                                price={product.price}
                                stock={product.stock}
                                title={product.title}
                                image={product.product_images?.[0]?.cloudinary_url}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20 border-t border-zinc-800 pt-12">
                <h2 className="text-2xl font-bold font-serif mb-8 text-white">Customer Reviews</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Review Form */}
                    <div className="lg:col-span-1">
                        <ReviewForm productId={product.id} />
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-2">
                        <ReviewsList productId={product.id} />
                    </div>
                </div>
            </div>

            {/* Q&A Section */}
            <div className="mt-20 border-t border-zinc-800 pt-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <ProductQA productId={product.id} />
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-20 border-t border-zinc-800 pt-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-20">
                    <RelatedProducts categoryId={product.category_id} currentId={product.id} />
                </div>
            </div>

        </div>
    )
}
