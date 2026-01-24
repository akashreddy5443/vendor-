import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { AddToCart } from '@/components/shop/AddToCart'
import { formatPrice } from '@/lib/utils'
import { ReviewForm } from '@/components/shop/ReviewForm'
import { ReviewsList } from '@/components/shop/ReviewsList'

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
        </div>
        </div >
    )
}
